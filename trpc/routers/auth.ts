import { router, publicProcedure } from "../init";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose";

export const authRouter = router({
  requestOtp: publicProcedure
    .input(z.object({ phone: z.string() }))
    .mutation(async ({ input }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.phone, input.phone),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No account found with this phone number",
        });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      const expiry = new Date(Date.now() + 10 * 60 * 1000);
      await db
        .update(users)
        .set({ otpCode: code, otpExpiresAt: expiry })
        .where(eq(users.id, user.id));

      console.log(`OTP for ${input.phone}: ${code}`);

      return { success: true };
    }),
  verifyOtp: publicProcedure
    .input(
      z.object({
        phone: z.string(),
        code: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.phone, input.phone),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No account found with this phone number",
        });
      }

      if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "OTP Code has expired",
        });
      }

      if (user.otpCode !== input.code) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid OTP Code",
        });
      }

      await db
        .update(users)
        .set({ otpExpiresAt: null, otpCode: null })
        .where(eq(users.id, user.id));

      const token = await new SignJWT({ userId: user.id })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(secret);

      return { success: true };
    }),
});

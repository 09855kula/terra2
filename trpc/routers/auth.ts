// trpc/routers/auth.ts

import { router, publicProcedure } from "../init";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

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
});

import { router, publicProcedure, protectedProcedure } from "../init";
import { z } from "zod";
import { db } from "@/db";
import { users, userAddresses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const usersRouter = router({
  create: publicProcedure
    .input(
      z.object({
        phone: z.string().min(10).max(20),
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ input }) => {
      const [user] = await db
        .insert(users)
        .values({
          phone: input.phone,
          firstName: input.firstName,
          lastName: input.lastName,
        })
        .returning();
      return user;
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const addresses = await db
      .select()
      .from(userAddresses)
      .where(eq(userAddresses.userId, ctx.user.id))
      .orderBy(desc(userAddresses.isPrimary));
    return { ...ctx.user, addresses };
  }),

  addAddress: protectedProcedure
    .input(
      z.object({
        address: z.string().min(5),
        label: z.string().optional(),
        notes: z.string().optional(),
        isPrimary: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.isPrimary) {
        await db
          .update(userAddresses)
          .set({ isPrimary: false })
          .where(eq(userAddresses.userId, ctx.user.id));
      }
      // isApproved defaults to false (admin-review flag) — not settable by the
      // customer; still fine to use for the order being placed right now.
      const [addr] = await db
        .insert(userAddresses)
        .values({ userId: ctx.user.id, ...input })
        .returning();
      return addr;
    }),
});

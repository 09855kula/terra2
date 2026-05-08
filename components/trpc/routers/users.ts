import { createTRPCRouter, publicProcedure } from "../init";
import { z } from "zod";
import { db } from "@/db";
import { users, customers } from "@/db/schema";

export const usersRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        phone: z.string().min(10).max(20),
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ input }) => {
      const newUser = await db.transaction(async (tx) => {
        const [user] = await tx
          .insert(users)
          .values({ phone: input.phone })
          .returning();

        await tx.insert(customers).values({
          userId: user.id,
          firstName: input.firstName,
          lastName: input.lastName,
        });

        return user;
      });

      return newUser;
    }),
});

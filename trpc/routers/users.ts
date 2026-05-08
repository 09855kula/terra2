import { router, publicProcedure } from "../init";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";

export const usersRouter = router({
  create: publicProcedure
    .input(
      z.object({
        phone: z.string().min(10).max(20),
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100),
      }),
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
});

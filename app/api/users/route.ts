import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users, customers } from "@/db/schema";

const createUserSchema = z.object({
  phone: z.string().min(10).max(20),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

export async function POST(request: Request) {
  const body = await request.json();

  const result = createUserSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 },
    );
  }

  const { phone, firstName, lastName } = result.data;

  try {
    const newUser = await db.transaction(async (tx) => {
      const [user] = await tx.insert(users).values({ phone }).returning();

      await tx
        .insert(customers)
        .values({ userId: user.id, firstName, lastName });

      return user;
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A user with this phone number already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

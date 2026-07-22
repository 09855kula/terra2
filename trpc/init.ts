import { TRPCError, initTRPC } from "@trpc/server";
import { jwtVerify } from "jose";
import superjson from "superjson";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createContext({
  req,
  resHeaders,
}: {
  req: Request;
  resHeaders: Headers;
}) {
  return { req, resHeaders };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const cookie = ctx.req.headers.get("cookie") ?? "";
  const token = cookie
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1]
    ?.trim();

  if (!token) throw new TRPCError({ code: "UNAUTHORIZED" });

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as number;
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
    return next({ ctx: { ...ctx, user } });
  } catch {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user.isAdmin) throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx });
});

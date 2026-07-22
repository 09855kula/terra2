import { router } from "../init";
import { usersRouter } from "./users";
import { authRouter } from "./auth";
import { productsRouter } from "./products";
import { ordersRouter } from "./orders";
import { adminRouter } from "./admin";

export const appRouter = router({
  users: usersRouter,
  auth: authRouter,
  products: productsRouter,
  orders: ordersRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;

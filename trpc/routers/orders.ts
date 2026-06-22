import { router, protectedProcedure } from "../init";
import { db } from "@/db";
import {
  orders,
  orderItems,
  deliverySchedules,
  userAddresses,
} from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

export const ordersRouter = router({
  getDeliverySchedules: protectedProcedure.query(async () => {
    return db
      .select({
        id: deliverySchedules.id,
        dayOfWeek: deliverySchedules.dayOfWeek,
        windowStart: deliverySchedules.windowStart,
        windowEnd: deliverySchedules.windowEnd,
        districtId: deliverySchedules.districtId,
      })
      .from(deliverySchedules);
  }),

  getActive: protectedProcedure.query(async ({ ctx }) => {
    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(eq(orders.userId, ctx.user.id), eq(orders.status, "pending"))
      )
      .orderBy(desc(orders.createdAt))
      .limit(1);

    if (!order) return null;

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    return { ...order, items };
  }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    return db
      .select()
      .from(orders)
      .where(eq(orders.userId, ctx.user.id))
      .orderBy(desc(orders.createdAt))
      .limit(20);
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [order] = await db
        .select()
        .from(orders)
        .where(
          and(eq(orders.id, input.id), eq(orders.userId, ctx.user.id))
        );

      if (!order) return null;

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      return { ...order, items };
    }),

  create: protectedProcedure
    .input(
      z.object({
        addressId: z.number(),
        deliveryDate: z.string(),
        timeslot: z.string(),
        change: z.string().optional(),
        comment: z.string().optional(),
        isUsePoint: z.boolean().default(false),
        items: z.array(
          z.object({
            productId: z.number(),
            productName: z.string(),
            quantity: z.number().min(1),
            unitPriceCents: z.number().min(0),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [addr] = await db
        .select()
        .from(userAddresses)
        .where(
          and(
            eq(userAddresses.id, input.addressId),
            eq(userAddresses.userId, ctx.user.id)
          )
        );

      if (!addr) throw new Error("Address not found");

      const totalCents = input.items.reduce(
        (s, i) => s + i.unitPriceCents * i.quantity,
        0
      );

      const [order] = await db
        .insert(orders)
        .values({
          userId: ctx.user.id,
          districtId: addr.districtId ?? undefined,
          address: addr.address,
          deliveryDate: new Date(input.deliveryDate),
          timeslot: input.timeslot,
          total: (totalCents / 100).toFixed(2),
          totalAfterDiscount: (totalCents / 100).toFixed(2),
          change: input.change,
          comment: input.comment,
          isUsePoint: input.isUsePoint,
          isWeb: true,
          status: "pending",
        })
        .returning();

      await db.insert(orderItems).values(
        input.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: (item.unitPriceCents / 100).toFixed(2),
          lineTotal: ((item.unitPriceCents * item.quantity) / 100).toFixed(2),
        }))
      );

      return order;
    }),
});

import { router, protectedProcedure } from "../init";
import { db } from "@/db";
import {
  orders,
  orderItems,
  userAddresses,
  users,
  products,
  productTiers,
  pointTransactions,
  unitOfMeasureEnum,
} from "@/db/schema";
import { eq, and, desc, sql, gt, lte, gte, inArray } from "drizzle-orm";
import { z } from "zod";

const MAX_POINTS_PER_ORDER = 20;

function calcPointsEarned(totalDollars: number, isVip: boolean): number {
  const base = Math.min(Math.floor(totalDollars / 50), MAX_POINTS_PER_ORDER);
  return isVip ? Math.floor(base * 1.5) : base;
}

export const ordersRouter = router({
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

  cancel: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [order] = await db
        .select()
        .from(orders)
        .where(and(eq(orders.id, input.id), eq(orders.userId, ctx.user.id)));

      if (!order) throw new Error("Order not found");
      if (order.status !== "pending") throw new Error("Order can no longer be cancelled");

      const [updated] = await db
        .update(orders)
        .set({ status: "cancelled" })
        .where(eq(orders.id, input.id))
        .returning();

      return updated;
    }),

  create: protectedProcedure
    .input(
      z.object({
        addressId: z.number(),
        deliveryDate: z.string(),
        timeslot: z.string(),
        change: z.string().optional(),
        comment: z.string().optional(),
        giftProductIds: z.array(z.number()).default([]),
        items: z.array(
          z.object({
            productId: z.number(),
            productName: z.string(),
            quantity: z.number().min(1),
            unitPriceCents: z.number().min(0),
            unitOfMeasure: z.string().nullable().optional(),
            shownAs: z.string().nullable().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return db.transaction(async (tx) => {
        const [addr] = await tx
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

        // Gift items picked via points redemption on the cart page — validated
        // and inserted as part of the same order, not a separate append-after step.
        const giftIds = [...new Set(input.giftProductIds)];
        let giftProducts: {
          id: number;
          name: string;
          giftablePoints: number;
          unitOfMeasure: (typeof unitOfMeasureEnum.enumValues)[number] | null;
          shownAs: string | null;
        }[] = [];
        let totalGiftCost = 0;

        if (giftIds.length > 0) {
          // Joined to productTiers so the gift line item snapshots real unit
          // data too, same as a paid item — not just the bare products row.
          giftProducts = await tx
            .select({
              id: products.id,
              name: products.name,
              giftablePoints: products.giftablePoints,
              unitOfMeasure: productTiers.unitOfMeasure,
              shownAs: productTiers.shownAs,
            })
            .from(products)
            .innerJoin(productTiers, eq(products.tierId, productTiers.id))
            .where(and(inArray(products.id, giftIds), eq(products.active, true)));

          if (giftProducts.length !== giftIds.length) {
            throw new Error("One or more gift items are no longer available");
          }
          if (giftProducts.some((p) => p.giftablePoints <= 0)) {
            throw new Error("One or more products are not giftable");
          }

          totalGiftCost = giftProducts.reduce((sum, p) => sum + p.giftablePoints, 0);
          if (totalGiftCost > ctx.user.points) {
            throw new Error("Not enough points for the selected gift items");
          }
        }

        const [order] = await tx
          .insert(orders)
          .values({
            userId: ctx.user.id,
            districtId: addr.districtId ?? undefined,
            address: addr.notes ? `${addr.address} — Note: ${addr.notes}` : addr.address,
            deliveryDate: new Date(input.deliveryDate),
            timeslot: input.timeslot,
            total: (totalCents / 100).toFixed(2),
            totalAfterDiscount: (totalCents / 100).toFixed(2),
            change: input.change,
            comment: input.comment,
            isUsePoint: giftProducts.length > 0,
            isWeb: true,
            status: "pending",
          })
          .returning();

        await tx.insert(orderItems).values(
          input.items.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitOfMeasure:
              (item.unitOfMeasure as (typeof unitOfMeasureEnum.enumValues)[number] | null) ?? null,
            shownAs: item.shownAs ?? null,
            unitPrice: (item.unitPriceCents / 100).toFixed(2),
            lineTotal: ((item.unitPriceCents * item.quantity) / 100).toFixed(2),
          }))
        );

        if (giftProducts.length > 0) {
          await tx.insert(orderItems).values(
            giftProducts.map((p) => ({
              orderId: order.id,
              productId: p.id,
              productName: p.name,
              quantity: 1,
              unitOfMeasure: p.unitOfMeasure,
              shownAs: p.shownAs,
              unitPrice: "0.00",
              lineTotal: "0.00",
            }))
          );

          const [deducted] = await tx
            .update(users)
            .set({ points: sql`${users.points} - ${totalGiftCost}` })
            .where(and(eq(users.id, ctx.user.id), gte(users.points, totalGiftCost)))
            .returning({ id: users.id });

          if (!deducted) throw new Error("Not enough points for the selected gift items");

          await tx.insert(pointTransactions).values({
            userId: ctx.user.id,
            amount: -totalGiftCost,
            reason: "redemption",
            orderId: order.id,
          });
        }

        const pointsEarned = calcPointsEarned(totalCents / 100, ctx.user.isVip);
        if (pointsEarned > 0) {
          await tx
            .update(users)
            .set({ points: sql`${users.points} + ${pointsEarned}` })
            .where(eq(users.id, ctx.user.id));
        }

        return order;
      });
    }),

  // Products the user can currently afford to redeem with points — "giftable"
  // means products.giftablePoints > 0 (no separate giftable flag in schema).
  getRedeemableItems: protectedProcedure.query(async ({ ctx }) => {
    return db
      .select()
      .from(products)
      .where(
        and(
          eq(products.active, true),
          gt(products.giftablePoints, 0),
          lte(products.giftablePoints, ctx.user.points)
        )
      )
      .orderBy(products.giftablePoints);
  }),
});

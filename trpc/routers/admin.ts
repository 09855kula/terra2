import { router, adminProcedure } from "../init";
import { db } from "@/db";
import {
  orders,
  orderItems,
  users,
  userAddresses,
  districts,
  pointTransactions,
  orderStatusEnum,
} from "@/db/schema";
import { eq, desc, and, gte, lte, count } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  DELIVERY_UPDATE_STAGES,
  DELIVERY_UPDATE_LABELS,
  type DeliveryUpdateStage,
} from "@/lib/utils/deliveryUpdates";

function deliveryUpdateMessage(stage: DeliveryUpdateStage, firstName: string): string {
  switch (stage) {
    case "20min":
      return `Hey ${firstName}, your Terra order is on its way! ETA ~20 min.`;
    case "10min":
      return `Almost there — ETA ~10 min for your Terra order.`;
    case "5min":
      return `Your driver is 5 min out.`;
    case "here":
      return `Your driver has arrived with your Terra order!`;
  }
}

export const adminRouter = router({
  me: adminProcedure.query(({ ctx }) => ({ id: ctx.user.id, isAdmin: ctx.user.isAdmin })),

  orderStatuses: adminProcedure.query(() => orderStatusEnum.enumValues),

  // Badge counts for the admin nav — "new" orders = pending (the entry point
  // to the status workflow), approvals = pending addresses + pending accounts
  // combined into a single nav badge.
  navCounts: adminProcedure.query(async () => {
    const [[orderRow], [addressRow], [accountRow]] = await Promise.all([
      db.select({ count: count() }).from(orders).where(eq(orders.status, "pending")),
      db
        .select({ count: count() })
        .from(userAddresses)
        .where(and(eq(userAddresses.isApproved, false), eq(userAddresses.isActive, true))),
      db.select({ count: count() }).from(users).where(eq(users.profileConfirmed, false)),
    ]);

    return {
      newOrders: orderRow.count,
      pendingApprovals: addressRow.count + accountRow.count,
    };
  }),

  approvals: router({
    districts: adminProcedure.query(() => db.select().from(districts).orderBy(districts.sortOrder)),

    addresses: adminProcedure.query(async () => {
      return db
        .select({
          id: userAddresses.id,
          label: userAddresses.label,
          address: userAddresses.address,
          notes: userAddresses.notes,
          districtId: userAddresses.districtId,
          createdAt: userAddresses.createdAt,
          customerFirstName: users.firstName,
          customerLastName: users.lastName,
          customerPhone: users.phone,
        })
        .from(userAddresses)
        .innerJoin(users, eq(userAddresses.userId, users.id))
        .where(and(eq(userAddresses.isApproved, false), eq(userAddresses.isActive, true)))
        .orderBy(desc(userAddresses.createdAt));
    }),

    accounts: adminProcedure.query(async () => {
      return db
        .select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          phone: users.phone,
          email: users.email,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.profileConfirmed, false))
        .orderBy(desc(users.createdAt));
    }),

    approveAddress: adminProcedure
      .input(z.object({ id: z.number(), districtId: z.number() }))
      .mutation(async ({ input }) => {
        const [updated] = await db
          .update(userAddresses)
          .set({ isApproved: true, districtId: input.districtId, updatedAt: new Date() })
          .where(eq(userAddresses.id, input.id))
          .returning();

        if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
        return updated;
      }),

    // Reject soft-deletes — sets isActive false rather than removing the row,
    // so the address (and eventually its history) is preserved instead of
    // lost. Excluded from the pending queue, nav badge count, and what a
    // customer can select at checkout (see users.ts/orders.ts).
    rejectAddress: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const [updated] = await db
          .update(userAddresses)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(userAddresses.id, input.id))
          .returning();

        if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
        return updated;
      }),

    approveAccount: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const [updated] = await db
          .update(users)
          .set({ profileConfirmed: true, updatedAt: new Date() })
          .where(eq(users.id, input.id))
          .returning();

        if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
        return updated;
      }),

    // Reject deletes the user row. Unconfirmed users are fully blocked at
    // login (verifyOtp throws before issuing a JWT), so a pending account
    // can't have placed orders, added addresses, or done anything else that
    // would FK-reference it through the normal app flow — deleting is safe
    // in the common case. The one theoretical edge is another user's
    // referredById pointing at this row (that field isn't set anywhere in
    // the current API, only possibly via legacy-imported data), so this is
    // wrapped to surface a clear error instead of a raw 500 if a foreign-key
    // constraint ever blocks it.
    rejectAccount: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        try {
          const [deleted] = await db
            .delete(users)
            .where(eq(users.id, input.id))
            .returning({ id: users.id });

          if (!deleted) throw new TRPCError({ code: "NOT_FOUND" });
          return deleted;
        } catch (err) {
          if (err instanceof TRPCError) throw err;
          // drizzle-orm wraps the underlying postgres.js error in a
          // DrizzleQueryError — the actual PostgresError (and its .code)
          // lands on .cause, not on the wrapper itself.
          const pgCode = (err as { cause?: { code?: string } }).cause?.code;
          if (pgCode === "23503") {
            throw new TRPCError({
              code: "CONFLICT",
              message:
                "Can't reject — this account has related records (orders, addresses, or referrals) and can't be deleted.",
            });
          }
          throw err;
        }
      }),
  }),

  orders: router({
    // Newest-first only — no ETA-based reordering here, that's a separate
    // list-view concern. Optional from/to (YYYY-MM-DD) filters on deliveryDate,
    // inclusive, for the Today/Tomorrow/All/custom-range filters in the UI.
    list: adminProcedure
      .input(
        z
          .object({
            from: z.string().optional(),
            to: z.string().optional(),
          })
          .optional(),
      )
      .query(async ({ input }) => {
        const conditions = [];
        if (input?.from) {
          conditions.push(gte(orders.deliveryDate, new Date(`${input.from}T00:00:00.000Z`)));
        }
        if (input?.to) {
          conditions.push(lte(orders.deliveryDate, new Date(`${input.to}T23:59:59.999Z`)));
        }
        const isFiltered = conditions.length > 0;

        return db
          .select({
            id: orders.id,
            orderNumber: orders.orderNumber,
            status: orders.status,
            totalAfterDiscount: orders.totalAfterDiscount,
            deliveryDate: orders.deliveryDate,
            createdAt: orders.createdAt,
            lastDeliveryUpdateStage: orders.lastDeliveryUpdateStage,
            lastDeliveryUpdateAt: orders.lastDeliveryUpdateAt,
            customerFirstName: users.firstName,
            customerLastName: users.lastName,
          })
          .from(orders)
          .innerJoin(users, eq(orders.userId, users.id))
          .where(isFiltered ? and(...conditions) : undefined)
          .orderBy(desc(orders.createdAt))
          .limit(isFiltered ? 200 : 50);
      }),

    byId: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const [row] = await db
          .select({ order: orders, customer: users, district: districts })
          .from(orders)
          .innerJoin(users, eq(orders.userId, users.id))
          .leftJoin(districts, eq(orders.districtId, districts.id))
          .where(eq(orders.id, input.id));

        if (!row) return null;

        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, input.id));

        const points = await db
          .select()
          .from(pointTransactions)
          .where(eq(pointTransactions.orderId, input.id));

        return {
          ...row.order,
          customer: row.customer,
          district: row.district,
          items,
          pointTransactions: points,
        };
      }),

    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(orderStatusEnum.enumValues),
        }),
      )
      .mutation(async ({ input }) => {
        const [updated] = await db
          .update(orders)
          .set({ status: input.status, updatedAt: new Date() })
          .where(eq(orders.id, input.id))
          .returning();

        if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
        return updated;
      }),

    // Delivery-update SMS — mirrors auth.ts's OTP fallback path exactly:
    // build the real message and console.log it. No Twilio call here yet,
    // even though TWILIO_* env vars exist, per explicit instruction not to
    // send real messages for this feature until it's signed off separately.
    sendDeliveryUpdate: adminProcedure
      .input(
        z.object({
          id: z.number(),
          stage: z.enum(DELIVERY_UPDATE_STAGES),
        }),
      )
      .mutation(async ({ input }) => {
        const [row] = await db
          .select({ phone: users.phone, firstName: users.firstName })
          .from(orders)
          .innerJoin(users, eq(orders.userId, users.id))
          .where(eq(orders.id, input.id));

        if (!row) throw new TRPCError({ code: "NOT_FOUND" });

        const message = deliveryUpdateMessage(input.stage, row.firstName ?? "there");
        console.log(`[SMS to ${row.phone}]: ${message}`);

        const sentAt = new Date();
        await db
          .update(orders)
          .set({ lastDeliveryUpdateStage: input.stage, lastDeliveryUpdateAt: sentAt })
          .where(eq(orders.id, input.id));

        return {
          label: DELIVERY_UPDATE_LABELS[input.stage],
          phone: row.phone,
          sentAt: sentAt.toISOString(),
        };
      }),
  }),
});

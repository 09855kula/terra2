import { router, adminProcedure } from "../init";
import { db } from "@/db";
import {
  orders,
  orderItems,
  users,
  districts,
  pointTransactions,
  orderStatusEnum,
} from "@/db/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const DELIVERY_STAGES = ["20min", "10min", "5min", "here"] as const;
type DeliveryStage = (typeof DELIVERY_STAGES)[number];

const DELIVERY_UPDATE_LABELS: Record<DeliveryStage, string> = {
  "20min": "20 min",
  "10min": "10 min",
  "5min": "5 min",
  here: "Here",
};

function deliveryUpdateMessage(stage: DeliveryStage, firstName: string): string {
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
          stage: z.enum(DELIVERY_STAGES),
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

        return {
          label: DELIVERY_UPDATE_LABELS[input.stage],
          phone: row.phone,
          sentAt: new Date().toISOString(),
        };
      }),
  }),
});

import { router, protectedProcedure } from "../init";
import { db } from "@/db";
import { products, productTiers, categoryGroups, operatingCalendar } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

export const productsRouter = router({
  groups: protectedProcedure.query(async () => {
    return db.select().from(categoryGroups).orderBy(categoryGroups.sortOrder);
  }),

  todayCalendar: protectedProcedure.query(async () => {
    const today = new Date().toISOString().slice(0, 10);
    const [entry] = await db
      .select()
      .from(operatingCalendar)
      .where(eq(operatingCalendar.calendarDate, today));
    return entry ?? null;
  }),

  list: protectedProcedure
    .input(z.object({ groupId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const conditions: ReturnType<typeof eq>[] = [eq(products.active, true)];
      if (input?.groupId) {
        conditions.push(eq(productTiers.groupId, input.groupId));
      }

      return db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          imgUrl: products.imgUrl,
          type: products.type,
          topEffect: products.topEffect,
          topFlavour: products.topFlavour,
          priceTag: products.priceTag,
          basePriceCents: products.basePriceCents,
          discountPct: products.discountPct,
          stock: products.stock,
          onSale: products.onSale,
          tierId: products.tierId,
          tierName: productTiers.name,
          tierPackSize: productTiers.packSize,
          tierUnitOfMeasure: productTiers.unitOfMeasure,
          tierShownAs: productTiers.shownAs,
          tierDiscountPct: productTiers.discountPct,
          groupId: productTiers.groupId,
          groupName: categoryGroups.name,
        })
        .from(products)
        .innerJoin(productTiers, eq(products.tierId, productTiers.id))
        .innerJoin(categoryGroups, eq(productTiers.groupId, categoryGroups.id))
        .where(and(...conditions))
        .orderBy(productTiers.sortOrder, products.name);
    }),
});

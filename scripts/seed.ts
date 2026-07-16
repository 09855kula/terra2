import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../db";
import {
  categoryGroups,
  deliverySchedules,
  districts,
  drivers,
  operatingCalendar,
  orderItems,
  orders,
  pointTransactions,
  productTiers,
  products,
  userAddresses,
  users,
} from "../db/schema";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function count(table: any): Promise<number> {
  const rows = (await db
    .select({ n: sql<number>`count(*)::int` })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .from(table)) as { n: number }[];
  return rows[0]?.n ?? 0;
}

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function main() {
  // ── 1. Districts ────────────────────────────────────────────
  let dtId = 0, mtId = 0, esId = 0, weId = 0;
  try {
    console.log("Seeding districts...");
    await db
      .insert(districts)
      .values([
        { code: "DT", name: "Downtown",  sortOrder: 1 },
        { code: "MT", name: "Midtown",   sortOrder: 2 },
        { code: "ES", name: "East Side", sortOrder: 3 },
        { code: "WE", name: "West End",  sortOrder: 4 },
      ])
      .onConflictDoNothing();
    const rows = await db.select().from(districts).orderBy(districts.sortOrder);
    dtId = rows.find((r) => r.code === "DT")?.id ?? 0;
    mtId = rows.find((r) => r.code === "MT")?.id ?? 0;
    esId = rows.find((r) => r.code === "ES")?.id ?? 0;
    weId = rows.find((r) => r.code === "WE")?.id ?? 0;
    console.log(`Seeded ${rows.length} districts`);
  } catch (err) {
    console.error("Error seeding districts:", err);
  }

  // ── 2. Category Groups ──────────────────────────────────────
  let budsId = 0, extractsId = 0, ediblesId = 0, mushroomsId = 0, dabPodId = 0;
  try {
    console.log("Seeding categoryGroups...");
    await db
      .insert(categoryGroups)
      .values([
        { name: "Buds",           sortOrder: 1 },
        { name: "Extracts",       sortOrder: 2 },
        { name: "Edibles",        sortOrder: 3 },
        { name: "Mushrooms",      sortOrder: 4 },
        { name: "Dab Pod System", sortOrder: 5 },
      ])
      .onConflictDoNothing();
    const rows = await db.select().from(categoryGroups).orderBy(categoryGroups.sortOrder);
    budsId      = rows.find((r) => r.name === "Buds")?.id ?? 0;
    extractsId  = rows.find((r) => r.name === "Extracts")?.id ?? 0;
    ediblesId   = rows.find((r) => r.name === "Edibles")?.id ?? 0;
    mushroomsId = rows.find((r) => r.name === "Mushrooms")?.id ?? 0;
    dabPodId    = rows.find((r) => r.name === "Dab Pod System")?.id ?? 0;
    console.log(`Seeded ${rows.length} categoryGroups`);
  } catch (err) {
    console.error("Error seeding categoryGroups:", err);
  }

  // ── 3. Product Tiers ────────────────────────────────────────
  let tierMap: Record<string, number> = {};
  try {
    console.log("Seeding productTiers...");
    if ((await count(productTiers)) === 0) {
      await db.insert(productTiers).values([
        // Buds
        { groupId: budsId,      name: "Budget",       packSize: 1, unitOfMeasure: "g",   shownAs: "3.5g",  sortOrder: 1 },
        { groupId: budsId,      name: "Mid-Grade",    packSize: 1, unitOfMeasure: "g",   shownAs: "3.5g",  sortOrder: 2 },
        { groupId: budsId,      name: "Top Shelf",    packSize: 1, unitOfMeasure: "g",   shownAs: "3.5g",  sortOrder: 3 },
        // Extracts
        { groupId: extractsId,  name: "Live Resin",   packSize: 1, unitOfMeasure: "g",   shownAs: "1g",    sortOrder: 1 },
        { groupId: extractsId,  name: "Shatter",      packSize: 1, unitOfMeasure: "g",   shownAs: "1g",    sortOrder: 2 },
        // Edibles
        { groupId: ediblesId,   name: "Gummies",      packSize: 1, unitOfMeasure: "pc",  shownAs: "pack",  sortOrder: 1 },
        { groupId: ediblesId,   name: "Chocolates",   packSize: 1, unitOfMeasure: "pc",  shownAs: "bar",   sortOrder: 2 },
        // Mushrooms
        { groupId: mushroomsId, name: "Dried",        packSize: 1, unitOfMeasure: "g",   shownAs: "3.5g",  sortOrder: 1 },
        { groupId: mushroomsId, name: "Capsules",     packSize: 1, unitOfMeasure: "pc",  shownAs: "pack",  sortOrder: 2 },
        // Dab Pod System
        { groupId: dabPodId,    name: "Pods",         packSize: 1, unitOfMeasure: "pod", shownAs: "pod",   sortOrder: 1 },
        { groupId: dabPodId,    name: "Starter Kits", packSize: 1, unitOfMeasure: "kit", shownAs: "kit",   sortOrder: 2 },
      ]);
    }
    const rows = await db.select().from(productTiers);
    tierMap = Object.fromEntries(rows.map((r) => [`${r.groupId}::${r.name}`, r.id]));
    console.log(`Seeded ${rows.length} productTiers`);
  } catch (err) {
    console.error("Error seeding productTiers:", err);
  }

  // ── 4. Products ─────────────────────────────────────────────
  // externalId is used as idempotency key (unique constraint)
  let pMap: Record<string, number> = {};
  try {
    console.log("Seeding products...");

    const budgetId    = tierMap[`${budsId}::Budget`]           ?? 0;
    const midId       = tierMap[`${budsId}::Mid-Grade`]        ?? 0;
    const topId       = tierMap[`${budsId}::Top Shelf`]        ?? 0;
    const lrId        = tierMap[`${extractsId}::Live Resin`]   ?? 0;
    const shId        = tierMap[`${extractsId}::Shatter`]      ?? 0;
    const gumId       = tierMap[`${ediblesId}::Gummies`]       ?? 0;
    const chocId      = tierMap[`${ediblesId}::Chocolates`]    ?? 0;
    const driedId     = tierMap[`${mushroomsId}::Dried`]       ?? 0;
    const capsId      = tierMap[`${mushroomsId}::Capsules`]    ?? 0;
    const podsId      = tierMap[`${dabPodId}::Pods`]           ?? 0;
    const kitsId      = tierMap[`${dabPodId}::Starter Kits`]   ?? 0;

    await db
      .insert(products)
      .values([
        // ── Budget Buds ──
        {
          tierId: budgetId, externalId: "seed-bud-budget-blue-dream",
          name: "Blue Dream", type: "sativa",
          description: "A classic sativa with uplifting energy and sweet blueberry notes.",
          topEffect: "Energizing", topFlavour: "Blueberry",
          basePriceCents: 2000, stock: 50, active: true, onSale: false,
        },
        {
          tierId: budgetId, externalId: "seed-bud-budget-og-kush",
          name: "OG Kush", type: "indica",
          description: "A legendary indica delivering deep relaxation with an earthy, pine aroma.",
          topEffect: "Relaxing", topFlavour: "Earthy",
          basePriceCents: 2000, stock: 40, active: true, onSale: false,
        },
        {
          tierId: budgetId, externalId: "seed-bud-budget-white-widow",
          name: "White Widow", type: "hybrid",
          description: "A balanced hybrid known for its crystal trichomes and euphoric high.",
          topEffect: "Balanced", topFlavour: "Pine",
          basePriceCents: 2000, stock: 35, active: true, onSale: false,
        },
        // ── Mid-Grade Buds ──
        {
          tierId: midId, externalId: "seed-bud-mid-gelato-33",
          name: "Gelato #33", type: "hybrid",
          description: "A dessert-like hybrid with powerful euphoric and creative effects.",
          topEffect: "Euphoric", topFlavour: "Sweet",
          basePriceCents: 3500, stock: 30, active: true, onSale: false,
        },
        {
          tierId: midId, externalId: "seed-bud-mid-northern-lights",
          name: "Northern Lights", type: "indica",
          description: "One of the most famous indicas — full-body relaxation with a spicy, sweet scent.",
          topEffect: "Sedating", topFlavour: "Spicy",
          basePriceCents: 3500, stock: 25, active: true, onSale: false,
        },
        {
          tierId: midId, externalId: "seed-bud-mid-green-crack",
          name: "Green Crack", type: "sativa",
          description: "Sharp focus and mango-citrus flavour in a high-energy sativa.",
          topEffect: "Focused", topFlavour: "Citrus",
          basePriceCents: 3500, stock: 20, active: true, onSale: false,
        },
        // ── Top Shelf Buds ──
        {
          tierId: topId, externalId: "seed-bud-top-pink-runtz",
          name: "Pink Runtz", type: "hybrid",
          description: "A visually stunning hybrid bursting with candy-sweet flavour and creative energy.",
          topEffect: "Creative", topFlavour: "Candy",
          basePriceCents: 5000, stock: 15, active: true, onSale: false,
        },
        {
          tierId: topId, externalId: "seed-bud-top-mac-1",
          name: "MAC 1", type: "hybrid",
          description: "Miracle Alien Cookies — a potent, complex hybrid with heavy diesel undertones.",
          topEffect: "Uplifting", topFlavour: "Diesel",
          basePriceCents: 5500, stock: 10, active: true, onSale: false,
        },
        {
          tierId: topId, externalId: "seed-bud-top-zkittlez",
          name: "Zkittlez", type: "indica",
          description: "An award-winning indica with an explosion of tropical fruit flavours.",
          topEffect: "Relaxing", topFlavour: "Fruity",
          basePriceCents: 5000, stock: 12, active: true, onSale: false,
        },
        // ── Live Resin ──
        {
          tierId: lrId, externalId: "seed-ext-lr-wedding-cake",
          name: "Wedding Cake Live Resin", type: "hybrid",
          description: "Rich full-spectrum live resin with creamy vanilla notes and euphoric effects.",
          topEffect: "Euphoric", topFlavour: "Vanilla",
          basePriceCents: 4500, stock: 20, active: true, onSale: false,
        },
        {
          tierId: lrId, externalId: "seed-ext-lr-sunset-sherbet",
          name: "Sunset Sherbet Live Resin", type: "hybrid",
          description: "Sherbet's signature berry sweetness captured in a premium live resin extract.",
          topEffect: "Relaxing", topFlavour: "Berry",
          basePriceCents: 4500, stock: 15, active: true, onSale: false,
        },
        {
          tierId: lrId, externalId: "seed-ext-lr-bruce-banner",
          name: "Bruce Banner Live Resin", type: "sativa",
          description: "High-THC live resin with explosive diesel fuel and energetic cerebral effects.",
          topEffect: "Energizing", topFlavour: "Diesel",
          basePriceCents: 5000, stock: 10, active: true, onSale: false,
        },
        // ── Shatter ──
        {
          tierId: shId, externalId: "seed-ext-sh-ak47",
          name: "AK-47 Shatter", type: "sativa",
          description: "A classic sativa shatter with long-lasting focused energy and earthy pine notes.",
          topEffect: "Focused", topFlavour: "Earthy",
          basePriceCents: 3500, stock: 25, active: true, onSale: false,
        },
        {
          tierId: shId, externalId: "seed-ext-sh-purple-punch",
          name: "Purple Punch Shatter", type: "indica",
          description: "Sweet grape candy and blueberry notes in a potent indica shatter.",
          topEffect: "Sedating", topFlavour: "Grape",
          basePriceCents: 3500, stock: 20, active: true, onSale: false,
        },
        // ── Gummies ──
        {
          tierId: gumId, externalId: "seed-edi-gum-mango-100",
          name: "Mango Gummies 100mg", type: null,
          description: "Tropical mango gummies — 10mg THC per piece, 10 pieces per pack.",
          topEffect: "Relaxing", topFlavour: "Mango",
          basePriceCents: 2500, stock: 40, active: true, onSale: false,
        },
        {
          tierId: gumId, externalId: "seed-edi-gum-watermelon-100",
          name: "Watermelon Gummies 100mg", type: null,
          description: "Refreshing watermelon gummies — 10mg THC per piece, 10 pieces per pack.",
          topEffect: "Euphoric", topFlavour: "Watermelon",
          basePriceCents: 2500, stock: 35, active: true, onSale: false,
        },
        {
          tierId: gumId, externalId: "seed-edi-gum-berry-200",
          name: "Mixed Berry Gummies 200mg", type: null,
          description: "Value pack — 20mg THC per piece, 10 pieces per pack.",
          topEffect: "Balanced", topFlavour: "Mixed Berry",
          basePriceCents: 4000, stock: 20, active: true, onSale: true,
        },
        // ── Chocolates ──
        {
          tierId: chocId, externalId: "seed-edi-choc-dark-100",
          name: "Dark Chocolate 100mg", type: null,
          description: "Rich 70% dark chocolate bar infused with 100mg THC.",
          topEffect: "Relaxing", topFlavour: "Dark Chocolate",
          basePriceCents: 3000, stock: 30, active: true, onSale: false,
        },
        {
          tierId: chocId, externalId: "seed-edi-choc-milk-100",
          name: "Milk Chocolate 100mg", type: null,
          description: "Creamy milk chocolate bar infused with 100mg THC.",
          topEffect: "Euphoric", topFlavour: "Milk Chocolate",
          basePriceCents: 3000, stock: 25, active: true, onSale: false,
        },
        // ── Dried Mushrooms ──
        {
          tierId: driedId, externalId: "seed-mush-dry-golden-teachers",
          name: "Golden Teachers", type: null,
          description: "A beginner-friendly strain known for gentle, insightful experiences.",
          topEffect: "Introspective", topFlavour: "Earthy",
          basePriceCents: 3500, stock: 20, active: true, onSale: false,
        },
        {
          tierId: driedId, externalId: "seed-mush-dry-blue-meanies",
          name: "Blue Meanies", type: null,
          description: "A potent strain with vibrant visuals and an energetic, mood-lifting effect.",
          topEffect: "Energizing", topFlavour: "Earthy",
          basePriceCents: 4000, stock: 15, active: true, onSale: false,
        },
        {
          tierId: driedId, externalId: "seed-mush-dry-albino-aplus",
          name: "Albino A+", type: null,
          description: "A rare albino strain delivering fast-acting euphoria with a mild flavour.",
          topEffect: "Euphoric", topFlavour: "Mild",
          basePriceCents: 4500, stock: 10, active: true, onSale: false,
        },
        // ── Capsules ──
        {
          tierId: capsId, externalId: "seed-mush-cap-microdose-30",
          name: "Micro-Dose Capsules 30pk", type: null,
          description: "30 capsules at 100mg each — ideal for productivity-focused micro-dosing.",
          topEffect: "Focused", topFlavour: null,
          basePriceCents: 3500, stock: 30, active: true, onSale: false,
        },
        {
          tierId: capsId, externalId: "seed-mush-cap-energy-blend",
          name: "Energy Blend Capsules", type: null,
          description: "Psilocybin blended with lion's mane and niacin for clean, sustained energy.",
          topEffect: "Energizing", topFlavour: null,
          basePriceCents: 4000, stock: 20, active: true, onSale: false,
        },
        // ── Dab Pods ──
        {
          tierId: podsId, externalId: "seed-dab-pod-blue-dream",
          name: "Live Resin Pod — Blue Dream", type: "sativa",
          description: "Full-spectrum Blue Dream live resin in a 1g dab pod.",
          topEffect: "Energizing", topFlavour: "Blueberry",
          basePriceCents: 5500, stock: 15, active: true, onSale: false,
        },
        {
          tierId: podsId, externalId: "seed-dab-pod-gelato",
          name: "Live Resin Pod — Gelato", type: "hybrid",
          description: "Full-spectrum Gelato live resin in a 1g dab pod.",
          topEffect: "Euphoric", topFlavour: "Sweet",
          basePriceCents: 5500, stock: 12, active: true, onSale: false,
        },
        {
          tierId: podsId, externalId: "seed-dab-pod-zkittlez",
          name: "Live Resin Pod — Zkittlez", type: "indica",
          description: "Full-spectrum Zkittlez live resin in a 1g dab pod.",
          topEffect: "Relaxing", topFlavour: "Fruity",
          basePriceCents: 5500, stock: 10, active: true, onSale: false,
        },
        // ── Starter Kit ──
        {
          tierId: kitsId, externalId: "seed-dab-kit-starter",
          name: "Dab Pod Starter Kit", type: null,
          description: "Everything you need to start: device, USB-C charger, and one pod of your choice.",
          topEffect: null, topFlavour: null,
          basePriceCents: 8000, stock: 10, active: true, onSale: false,
        },
      ])
      .onConflictDoNothing();

    const rows = await db
      .select({ id: products.id, externalId: products.externalId })
      .from(products);
    pMap = Object.fromEntries(
      rows.filter((r) => r.externalId).map((r) => [r.externalId!, r.id])
    );
    console.log(`Seeded ${rows.length} products`);
  } catch (err) {
    console.error("Error seeding products:", err);
  }

  // ── 5. Users ────────────────────────────────────────────────
  let johnId = 0, janeId = 0, travisUserId = 0, mikeUserId = 0;
  try {
    console.log("Seeding users...");
    await db
      .insert(users)
      .values([
        {
          phone: "+14165550001", firstName: "Admin", lastName: "User",
          isAdmin: true, isCustomer: false, isDriver: false,
          points: 0, isVip: false, profileConfirmed: true,
        },
        {
          phone: "+14165550002", firstName: "John", lastName: "Doe",
          isAdmin: false, isCustomer: true, isDriver: false,
          points: 150, isVip: false, profileConfirmed: true,
        },
        {
          phone: "+14165550003", firstName: "Jane", lastName: "Smith",
          isAdmin: false, isCustomer: true, isDriver: false,
          points: 500, isVip: true, profileConfirmed: true,
        },
        {
          phone: "+14165550004", firstName: "Travis", lastName: "B",
          isAdmin: false, isCustomer: false, isDriver: true,
          points: 0, isVip: false, profileConfirmed: true,
        },
        {
          phone: "+14165550005", firstName: "Mike", lastName: "C",
          isAdmin: false, isCustomer: false, isDriver: true,
          points: 0, isVip: false, profileConfirmed: true,
        },
      ])
      .onConflictDoNothing();
    const rows = await db.select().from(users);
    johnId      = rows.find((r) => r.phone === "+14165550002")?.id ?? 0;
    janeId      = rows.find((r) => r.phone === "+14165550003")?.id ?? 0;
    travisUserId = rows.find((r) => r.phone === "+14165550004")?.id ?? 0;
    mikeUserId  = rows.find((r) => r.phone === "+14165550005")?.id ?? 0;
    console.log(`Seeded ${rows.length} users`);
  } catch (err) {
    console.error("Error seeding users:", err);
  }

  // ── 6. User Addresses ───────────────────────────────────────
  try {
    console.log("Seeding userAddresses...");
    if ((await count(userAddresses)) === 0) {
      await db.insert(userAddresses).values([
        {
          userId: johnId, districtId: dtId,
          label: "Home", address: "123 Main Street, Downtown, Toronto ON",
          isPrimary: true,
        },
        {
          userId: johnId, districtId: mtId,
          label: "Work", address: "456 Bay Avenue, Midtown, Toronto ON",
          isPrimary: false,
        },
        {
          userId: janeId, districtId: esId,
          label: "Home", address: "789 Oak Street, East Side, Toronto ON",
          isPrimary: true,
        },
        {
          userId: janeId, districtId: weId,
          label: "Cottage", address: "321 Pine Road, West End, Toronto ON",
          isPrimary: false,
        },
      ]);
    }
    const rows = await db.select().from(userAddresses);
    console.log(`Seeded ${rows.length} userAddresses`);
  } catch (err) {
    console.error("Error seeding userAddresses:", err);
  }

  // ── 7. Drivers ──────────────────────────────────────────────
  let driver1Id = 0, driver2Id = 0;
  try {
    console.log("Seeding drivers...");
    await db
      .insert(drivers)
      .values([
        { userId: travisUserId, name: "Travis", active: true },
        { userId: mikeUserId,   name: "Mike",   active: true },
      ])
      .onConflictDoNothing();
    const rows = await db.select().from(drivers);
    driver1Id = rows.find((r) => r.userId === travisUserId)?.id ?? 0;
    driver2Id = rows.find((r) => r.userId === mikeUserId)?.id ?? 0;
    console.log(`Seeded ${rows.length} drivers`);
  } catch (err) {
    console.error("Error seeding drivers:", err);
  }

  // ── 8. Delivery Schedules ───────────────────────────────────
  try {
    console.log("Seeding deliverySchedules...");
    if ((await count(deliverySchedules)) === 0) {
      // dayOfWeek: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
      await db.insert(deliverySchedules).values([
        // Travis (driver1): Downtown — Mon/Wed/Fri two windows, Tue/Thu single window
        { driverId: driver1Id, districtId: dtId, dayOfWeek: 1, windowNumber: 1, windowStart: "10:00", windowEnd: "14:00", routeOrder: 1 },
        { driverId: driver1Id, districtId: dtId, dayOfWeek: 1, windowNumber: 2, windowStart: "14:00", windowEnd: "18:00", routeOrder: 2 },
        { driverId: driver1Id, districtId: dtId, dayOfWeek: 2, windowNumber: 1, windowStart: "10:00", windowEnd: "18:00", routeOrder: 1 },
        { driverId: driver1Id, districtId: dtId, dayOfWeek: 3, windowNumber: 1, windowStart: "10:00", windowEnd: "18:00", routeOrder: 1 },
        { driverId: driver1Id, districtId: dtId, dayOfWeek: 4, windowNumber: 1, windowStart: "10:00", windowEnd: "18:00", routeOrder: 1 },
        { driverId: driver1Id, districtId: dtId, dayOfWeek: 5, windowNumber: 1, windowStart: "10:00", windowEnd: "18:00", routeOrder: 1 },
        // Travis (driver1): Midtown — Mon/Wed/Fri two windows, Tue/Thu single window
        { driverId: driver1Id, districtId: mtId, dayOfWeek: 1, windowNumber: 1, windowStart: "10:00", windowEnd: "14:00", routeOrder: 3 },
        { driverId: driver1Id, districtId: mtId, dayOfWeek: 1, windowNumber: 2, windowStart: "14:00", windowEnd: "18:00", routeOrder: 4 },
        { driverId: driver1Id, districtId: mtId, dayOfWeek: 2, windowNumber: 1, windowStart: "10:00", windowEnd: "18:00", routeOrder: 2 },
        { driverId: driver1Id, districtId: mtId, dayOfWeek: 3, windowNumber: 1, windowStart: "10:00", windowEnd: "18:00", routeOrder: 2 },
        { driverId: driver1Id, districtId: mtId, dayOfWeek: 4, windowNumber: 1, windowStart: "10:00", windowEnd: "18:00", routeOrder: 2 },
        { driverId: driver1Id, districtId: mtId, dayOfWeek: 5, windowNumber: 1, windowStart: "10:00", windowEnd: "18:00", routeOrder: 2 },
        // Mike (driver2): East Side — Mon–Fri
        { driverId: driver2Id, districtId: esId, dayOfWeek: 1, windowNumber: 1, windowStart: "11:00", windowEnd: "17:00", routeOrder: 1 },
        { driverId: driver2Id, districtId: esId, dayOfWeek: 2, windowNumber: 1, windowStart: "11:00", windowEnd: "17:00", routeOrder: 1 },
        { driverId: driver2Id, districtId: esId, dayOfWeek: 3, windowNumber: 1, windowStart: "11:00", windowEnd: "17:00", routeOrder: 1 },
        { driverId: driver2Id, districtId: esId, dayOfWeek: 4, windowNumber: 1, windowStart: "11:00", windowEnd: "17:00", routeOrder: 1 },
        { driverId: driver2Id, districtId: esId, dayOfWeek: 5, windowNumber: 1, windowStart: "11:00", windowEnd: "17:00", routeOrder: 1 },
        // Mike (driver2): West End — Mon–Fri
        { driverId: driver2Id, districtId: weId, dayOfWeek: 1, windowNumber: 1, windowStart: "12:00", windowEnd: "18:00", routeOrder: 2 },
        { driverId: driver2Id, districtId: weId, dayOfWeek: 2, windowNumber: 1, windowStart: "12:00", windowEnd: "18:00", routeOrder: 2 },
        { driverId: driver2Id, districtId: weId, dayOfWeek: 3, windowNumber: 1, windowStart: "12:00", windowEnd: "18:00", routeOrder: 2 },
        { driverId: driver2Id, districtId: weId, dayOfWeek: 4, windowNumber: 1, windowStart: "12:00", windowEnd: "18:00", routeOrder: 2 },
        { driverId: driver2Id, districtId: weId, dayOfWeek: 5, windowNumber: 1, windowStart: "12:00", windowEnd: "18:00", routeOrder: 2 },
      ]);
    }
    const n = await count(deliverySchedules);
    console.log(`Seeded ${n} deliverySchedules`);
  } catch (err) {
    console.error("Error seeding deliverySchedules:", err);
  }

  // ── 9. Operating Calendar (next 30 days) ────────────────────
  try {
    console.log("Seeding operatingCalendar...");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let saleScheduled = false;
    const entries: (typeof operatingCalendar.$inferInsert)[] = [];

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const calendarDate = isoDate(d);
      const dow = d.getDay(); // 0=Sun, 6=Sat
      const isOpen = dow !== 0 && dow !== 6;

      // First open weekday at least 3 days out gets a 10% sale
      const hasSale = isOpen && !saleScheduled && i >= 3;
      if (hasSale) saleScheduled = true;

      entries.push({
        calendarDate,
        isOpen,
        salePct: hasSale ? "10.00" : null,
        pointsMultiplier: null,
        notes: hasSale ? "Flash sale — 10% off all products" : null,
      });
    }

    await db.insert(operatingCalendar).values(entries).onConflictDoNothing();
    const n = await count(operatingCalendar);
    console.log(`Seeded ${n} operatingCalendar entries`);
  } catch (err) {
    console.error("Error seeding operatingCalendar:", err);
  }

  // ── 10. Orders ──────────────────────────────────────────────
  // mongoId used as idempotency key (unique constraint)
  let order1Id = 0, order2Id = 0, order3Id = 0;
  try {
    console.log("Seeding orders...");
    await db
      .insert(orders)
      .values([
        {
          userId: johnId, districtId: dtId,
          address: "123 Main Street, Downtown, Toronto ON",
          orderNumber: 1001, status: "complete",
          total: "65.00", totalAfterDiscount: "65.00",
          isWeb: true,
          deliveryDate: daysAgo(14),
          completedAt: daysAgo(14),
          createdAt: daysAgo(14),
          updatedAt: daysAgo(14),
          mongoId: "seed-order-1001",
        },
        {
          userId: johnId, districtId: esId,
          address: "456 Bay Avenue, Midtown, Toronto ON",
          orderNumber: 1002, status: "complete",
          total: "90.00", totalAfterDiscount: "90.00",
          isWeb: true,
          deliveryDate: daysAgo(7),
          completedAt: daysAgo(7),
          createdAt: daysAgo(7),
          updatedAt: daysAgo(7),
          mongoId: "seed-order-1002",
        },
        {
          userId: janeId, districtId: weId,
          address: "321 Pine Road, West End, Toronto ON",
          orderNumber: 1003, status: "accepted",
          total: "115.00", totalAfterDiscount: "115.00",
          isWeb: true,
          deliveryDate: daysAgo(2),
          createdAt: daysAgo(2),
          updatedAt: daysAgo(2),
          mongoId: "seed-order-1003",
        },
      ])
      .onConflictDoNothing();

    const rows = await db
      .select({ id: orders.id, mongoId: orders.mongoId })
      .from(orders);
    order1Id = rows.find((r) => r.mongoId === "seed-order-1001")?.id ?? 0;
    order2Id = rows.find((r) => r.mongoId === "seed-order-1002")?.id ?? 0;
    order3Id = rows.find((r) => r.mongoId === "seed-order-1003")?.id ?? 0;
    console.log(`Seeded ${rows.length} orders`);
  } catch (err) {
    console.error("Error seeding orders:", err);
  }

  // ── 11. Order Items ─────────────────────────────────────────
  try {
    console.log("Seeding orderItems...");
    if ((await count(orderItems)) === 0) {
      const pid = (key: string) => pMap[key] ?? 0;
      await db.insert(orderItems).values([
        // Order 1 (John, complete): Blue Dream ×2 + Mango Gummies ×1 = $65
        { orderId: order1Id, productId: pid("seed-bud-budget-blue-dream"),  productName: "Blue Dream",            quantity: 2, unitPrice: "20.00", lineTotal: "40.00" },
        { orderId: order1Id, productId: pid("seed-edi-gum-mango-100"),      productName: "Mango Gummies 100mg",   quantity: 1, unitPrice: "25.00", lineTotal: "25.00" },
        // Order 2 (John, complete): Gelato #33 ×1 + MAC 1 ×1 = $90
        { orderId: order2Id, productId: pid("seed-bud-mid-gelato-33"),      productName: "Gelato #33",            quantity: 1, unitPrice: "35.00", lineTotal: "35.00" },
        { orderId: order2Id, productId: pid("seed-bud-top-mac-1"),          productName: "MAC 1",                 quantity: 1, unitPrice: "55.00", lineTotal: "55.00" },
        // Order 3 (Jane, accepted): Pink Runtz ×1 + Golden Teachers ×1 + Milk Chocolate ×1 = $115
        { orderId: order3Id, productId: pid("seed-bud-top-pink-runtz"),     productName: "Pink Runtz",            quantity: 1, unitPrice: "50.00", lineTotal: "50.00" },
        { orderId: order3Id, productId: pid("seed-mush-dry-golden-teachers"), productName: "Golden Teachers",     quantity: 1, unitPrice: "35.00", lineTotal: "35.00" },
        { orderId: order3Id, productId: pid("seed-edi-choc-milk-100"),      productName: "Milk Chocolate 100mg",  quantity: 1, unitPrice: "30.00", lineTotal: "30.00" },
      ]);
    }
    const n = await count(orderItems);
    console.log(`Seeded ${n} orderItems`);
  } catch (err) {
    console.error("Error seeding orderItems:", err);
  }

  // ── 12. Point Transactions ──────────────────────────────────
  // John: +100 + 75 − 25 = 150 ✓   Jane: +200 + 350 − 50 = 500 ✓
  try {
    console.log("Seeding pointTransactions...");
    if ((await count(pointTransactions)) === 0) {
      await db.insert(pointTransactions).values([
        { userId: johnId, amount:  100, reason: "order_complete", orderId: order1Id || null },
        { userId: johnId, amount:   75, reason: "order_complete", orderId: order2Id || null },
        { userId: johnId, amount:  -25, reason: "redeemed",       orderId: null },
        { userId: janeId, amount:  200, reason: "order_complete", orderId: order3Id || null },
        { userId: janeId, amount:  350, reason: "historical",     orderId: null },
        { userId: janeId, amount:  -50, reason: "redeemed",       orderId: null },
      ]);
    }
    const n = await count(pointTransactions);
    console.log(`Seeded ${n} pointTransactions`);
  } catch (err) {
    console.error("Error seeding pointTransactions:", err);
  }

  console.log("\nSeed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});

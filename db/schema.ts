import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  date,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { type AnyPgColumn } from "drizzle-orm/pg-core";
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "accepted",
  "complete",
  "cancelled",
  "etf",
  "etf_complete",
  "iou",
  "iou_complete",
  "exchange",
]);

export const productTypeEnum = pgEnum("product_type", [
  "sativa",
  "indica",
  "hybrid",
]);

export const unitOfMeasureEnum = pgEnum("unit_of_measure", [
  "g",
  "oz",
  "pc",
  "pod",
  "kit",
]);

export const districts = pgTable("districts", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  name: varchar("name", { length: 100 }),
  sortOrder: integer("sort_order"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  phone: varchar("phone", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 255 }).unique(),

  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),

  isCustomer: boolean("is_customer").notNull().default(false),
  isDriver: boolean("is_driver").notNull().default(false),
  isAdmin: boolean("is_admin").notNull().default(false),

  points: integer("points").notNull().default(0),
  isVip: boolean("is_vip").notNull().default(false),

  referredById: integer("referred_by_id").references(
    (): AnyPgColumn => users.id,
  ),

  mongoId: varchar("mongo_id", { length: 50 }).unique(),
  profileConfirmed: boolean("profile_confirmed").notNull().default(false),
  firstOrder: boolean("first_order").notNull().default(false),

  otpCode: varchar("otp_code", { length: 10 }),
  otpExpiresAt: timestamp("otp_expires_at", { withTimezone: true }),

  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const userAddresses = pgTable("user_addresses", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  districtId: integer("district_id").references(() => districts.id),

  label: varchar("label", { length: 100 }),
  address: text("address").notNull(),
  notes: text("notes"),
  isPrimary: boolean("is_primary").notNull().default(false),
  // Admin-reviewed flag — new addresses start unapproved but are still usable
  // for the order being placed right now. Approval UI is admin-panel-only,
  // out of scope until that milestone.
  isApproved: boolean("is_approved").notNull().default(false),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const drivers = pgTable(
  "drivers",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id),

    name: varchar("name", { length: 100 }),
    active: boolean("active").notNull().default(true),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("drivers_user_id_idx").on(table.userId)],
);

export const categoryGroups = pgTable("category_groups", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  sortOrder: integer("sort_order"),
});

export const productTiers = pgTable("product_tiers", {
  id: serial("id").primaryKey(),

  groupId: integer("group_id")
    .notNull()
    .references(() => categoryGroups.id),

  name: varchar("name", { length: 100 }).notNull(),
  packSize: integer("pack_size").notNull().default(1),
  unitOfMeasure: unitOfMeasureEnum("unit_of_measure"),
  shownAs: varchar("shown_as", { length: 50 }),
  procurementCost: numeric("procurement_cost", { precision: 10, scale: 2 }),
  giftablePoints: integer("giftable_points").notNull().default(0),
  discountPct: numeric("discount_pct", { precision: 5, scale: 2 }),
  sortOrder: integer("sort_order"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),

  tierId: integer("tier_id")
    .notNull()
    .references(() => productTiers.id),

  name: varchar("name", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }),
  description: text("description"),
  imgUrl: text("img_url"),
  type: productTypeEnum("type"),
  topEffect: varchar("top_effect", { length: 100 }),
  topFlavour: varchar("top_flavour", { length: 100 }),
  priceTag: varchar("price_tag", { length: 50 }),
  basePriceCents: integer("base_price_cents"),
  procurementCost: numeric("procurement_cost", { precision: 10, scale: 2 }),
  discountPct: numeric("discount_pct", { precision: 5, scale: 2 }),
  stock: integer("stock").notNull().default(0),
  active: boolean("active").notNull().default(true),
  onSale: boolean("on_sale").notNull().default(false),
  totalSold: integer("total_sold").notNull().default(0),
  giftablePoints: integer("giftable_points").notNull().default(0),
  externalId: varchar("external_id", { length: 100 }).unique(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  districtId: integer("district_id").references(() => districts.id),

  address: text("address"),
  orderNumber: integer("order_number"),
  status: orderStatusEnum("status").notNull().default("pending"),

  deliveryDate: timestamp("delivery_date", { withTimezone: true }),
  timeslot: varchar("timeslot", { length: 50 }),
  cutOffs: varchar("cut_offs", { length: 50 }),

  total: numeric("total", { precision: 10, scale: 2 }),
  totalAfterDiscount: numeric("total_after_discount", {
    precision: 10,
    scale: 2,
  }),
  outstandingBalance: numeric("outstanding_balance", {
    precision: 10,
    scale: 2,
  }),
  change: varchar("change", { length: 50 }),

  isWeb: boolean("is_web").notNull().default(false),
  isClose: boolean("is_close").notNull().default(false),
  isUsePoint: boolean("is_use_point").notNull().default(false),

  comment: text("comment"),
  productsData: jsonb("products_data"),
  userInfo: jsonb("user_info"),

  mongoId: varchar("mongo_id", { length: 50 }).unique(),

  // Last admin-triggered delivery-update SMS ("20min"/"10min"/"5min"/"here")
  // — console-logged only for now, see admin.ts. Nullable until the first one
  // is sent for this order.
  lastDeliveryUpdateStage: varchar("last_delivery_update_stage", { length: 20 }),
  lastDeliveryUpdateAt: timestamp("last_delivery_update_at", { withTimezone: true }),

  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),

  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  productId: integer("product_id").references(() => products.id),

  productName: varchar("product_name", { length: 255 }),
  quantity: integer("quantity").notNull().default(1),
  // Snapshot of the product tier's unit/shownAs at order time (not a live
  // reference) — quantity is a multiplier of shownAs (e.g. 8 × "3.5g" = 28g),
  // same convention as CartItem.tierUnitOfMeasure/tierShownAs.
  unitOfMeasure: unitOfMeasureEnum("unit_of_measure"),
  shownAs: varchar("shown_as", { length: 50 }),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }),
  lineTotal: numeric("line_total", { precision: 10, scale: 2 }),
});

export const deliverySchedules = pgTable("delivery_schedules", {
  id: serial("id").primaryKey(),

  driverId: integer("driver_id")
    .notNull()
    .references(() => drivers.id),
  districtId: integer("district_id")
    .notNull()
    .references(() => districts.id),

  dayOfWeek: integer("day_of_week").notNull(),
  windowNumber: integer("window_number").notNull().default(1),
  windowStart: varchar("window_start", { length: 10 }),
  windowEnd: varchar("window_end", { length: 10 }),
  routeOrder: integer("route_order"),
});

export const operatingCalendar = pgTable("operating_calendar", {
  id: serial("id").primaryKey(),

  calendarDate: date("calendar_date").notNull().unique(),
  isOpen: boolean("is_open").notNull().default(true),
  salePct: numeric("sale_pct", { precision: 5, scale: 2 }),
  pointsMultiplier: numeric("points_multiplier", { precision: 4, scale: 2 }),
  notes: text("notes"),
});

export const pointTransactions = pgTable("point_transactions", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  amount: integer("amount").notNull(),
  reason: varchar("reason", { length: 100 }).notNull(),
  orderId: integer("order_id").references(() => orders.id),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

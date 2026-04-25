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

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "accepted",
  "complete",
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

  passwordHash: varchar("password_hash", { length: 255 }).notNull(),

  isCustomer: boolean("is_customer").notNull().default(false),
  isDriver: boolean("is_driver").notNull().default(false),
  isAdmin: boolean("is_admin").notNull().default(false),

  otpCode: varchar("otp_code", { length: 10 }),
  otpExpiresAt: timestamp("otp_expires_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const customers = pgTable(
  "customers",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id),

    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    username: varchar("username", { length: 100 }),

    points: integer("points").notNull().default(0),

    isVip: boolean("is_vip").notNull().default(false),

    referredById: integer("referred_by_id"),

    mongoId: varchar("mongo_id", { length: 50 }).unique(),

    useSafari: boolean("use_safari"),
    isTokenInvalid: boolean("is_token_invalid"),
    isTokenReverse: boolean("is_token_reverse"),
    isTokenRight: boolean("is_token_right"),
    newProfile: boolean("new_profile"),
    profileConfirmed: boolean("profile_confirmed"),
    firstOrder: boolean("first_order"),
    fiveWeeksAlert: boolean("five_weeks_alert"),
    sixWeeksAlert: boolean("six_weeks_alert"),
    sevenWeeksAlert: boolean("seven_weeks_alert"),

    limited: timestamp("limited", { withTimezone: true }),
    fiveWeeksLimited: timestamp("five_weeks_limited", { withTimezone: true }),
    sixWeeksLimited: timestamp("six_weeks_limited", { withTimezone: true }),
    sevenWeeksLimited: timestamp("seven_weeks_limited", { withTimezone: true }),
    lastLogin: timestamp("last_login", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("customers_user_id_idx").on(table.userId)],
);

export const customerAddresses = pgTable("customer_addresses", {
  id: serial("id").primaryKey(),

  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),

  districtId: integer("district_id").references(() => districts.id),

  label: varchar("label", { length: 100 }),

  address: text("address").notNull(),

  isPrimary: boolean("is_primary").notNull().default(false),

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

  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),

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

  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),

  amount: integer("amount").notNull(),

  reason: varchar("reason", { length: 100 }).notNull(),

  orderId: integer("order_id").references(() => orders.id),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

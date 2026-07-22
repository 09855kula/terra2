CREATE TYPE "public"."order_status" AS ENUM('pending', 'accepted', 'complete', 'cancelled', 'etf', 'etf_complete', 'iou', 'iou_complete', 'exchange');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('sativa', 'indica', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."unit_of_measure" AS ENUM('g', 'oz', 'pc', 'pod', 'kit');--> statement-breakpoint
CREATE TABLE "category_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"sort_order" integer,
	CONSTRAINT "category_groups_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "delivery_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"driver_id" integer NOT NULL,
	"district_id" integer NOT NULL,
	"day_of_week" integer NOT NULL,
	"window_number" integer DEFAULT 1 NOT NULL,
	"window_start" varchar(10),
	"window_end" varchar(10),
	"route_order" integer
);
--> statement-breakpoint
CREATE TABLE "districts" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(10) NOT NULL,
	"name" varchar(100),
	"sort_order" integer,
	CONSTRAINT "districts_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(100),
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "operating_calendar" (
	"id" serial PRIMARY KEY NOT NULL,
	"calendar_date" date NOT NULL,
	"is_open" boolean DEFAULT true NOT NULL,
	"sale_pct" numeric(5, 2),
	"points_multiplier" numeric(4, 2),
	"notes" text,
	CONSTRAINT "operating_calendar_calendar_date_unique" UNIQUE("calendar_date")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer,
	"product_name" varchar(255),
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_of_measure" "unit_of_measure",
	"shown_as" varchar(50),
	"unit_price" numeric(10, 2),
	"line_total" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"district_id" integer,
	"address" text,
	"order_number" integer,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"delivery_date" timestamp with time zone,
	"timeslot" varchar(50),
	"cut_offs" varchar(50),
	"total" numeric(10, 2),
	"total_after_discount" numeric(10, 2),
	"outstanding_balance" numeric(10, 2),
	"change" varchar(50),
	"is_web" boolean DEFAULT false NOT NULL,
	"is_close" boolean DEFAULT false NOT NULL,
	"is_use_point" boolean DEFAULT false NOT NULL,
	"comment" text,
	"products_data" jsonb,
	"user_info" jsonb,
	"mongo_id" varchar(50),
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_mongo_id_unique" UNIQUE("mongo_id")
);
--> statement-breakpoint
CREATE TABLE "point_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"reason" varchar(100) NOT NULL,
	"order_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_tiers" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"pack_size" integer DEFAULT 1 NOT NULL,
	"unit_of_measure" "unit_of_measure",
	"shown_as" varchar(50),
	"procurement_cost" numeric(10, 2),
	"giftable_points" integer DEFAULT 0 NOT NULL,
	"discount_pct" numeric(5, 2),
	"sort_order" integer
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"tier_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"original_name" varchar(255),
	"description" text,
	"img_url" text,
	"type" "product_type",
	"top_effect" varchar(100),
	"top_flavour" varchar(100),
	"price_tag" varchar(50),
	"base_price_cents" integer,
	"procurement_cost" numeric(10, 2),
	"discount_pct" numeric(5, 2),
	"stock" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"on_sale" boolean DEFAULT false NOT NULL,
	"total_sold" integer DEFAULT 0 NOT NULL,
	"giftable_points" integer DEFAULT 0 NOT NULL,
	"external_id" varchar(100),
	CONSTRAINT "products_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "user_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"district_id" integer,
	"label" varchar(100),
	"address" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(255),
	"first_name" varchar(100),
	"last_name" varchar(100),
	"is_customer" boolean DEFAULT false NOT NULL,
	"is_driver" boolean DEFAULT false NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"is_vip" boolean DEFAULT false NOT NULL,
	"referred_by_id" integer,
	"mongo_id" varchar(50),
	"profile_confirmed" boolean DEFAULT false NOT NULL,
	"first_order" boolean DEFAULT false NOT NULL,
	"otp_code" varchar(10),
	"otp_expires_at" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_mongo_id_unique" UNIQUE("mongo_id")
);
--> statement-breakpoint
ALTER TABLE "delivery_schedules" ADD CONSTRAINT "delivery_schedules_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_schedules" ADD CONSTRAINT "delivery_schedules_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_tiers" ADD CONSTRAINT "product_tiers_group_id_category_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."category_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_tier_id_product_tiers_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."product_tiers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_referred_by_id_users_id_fk" FOREIGN KEY ("referred_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "drivers_user_id_idx" ON "drivers" USING btree ("user_id");
ALTER TABLE "orders" ADD COLUMN "last_delivery_update_stage" varchar(20);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "last_delivery_update_at" timestamp with time zone;
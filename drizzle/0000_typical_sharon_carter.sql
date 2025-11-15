CREATE TYPE "public"."status_notification" AS ENUM('PENDING', 'ONPROGRESS', 'SENT', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."status_transaction" AS ENUM('PENDING', 'ORDERED', 'RECEIVED', 'CANCELLED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."type_movement" AS ENUM('IN', 'OUT', 'CHECK');--> statement-breakpoint
CREATE TYPE "public"."type_transaction" AS ENUM('IN', 'OUT', 'CHECK');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'HEADKITCHEN', 'MANAGER');--> statement-breakpoint
CREATE TABLE "category" (
	"id_category" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_category" varchar(255) NOT NULL,
	CONSTRAINT "category_name_category_unique" UNIQUE("name_category")
);
--> statement-breakpoint
CREATE TABLE "detail_transaction" (
	"id_detail_transaction" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_id" varchar(225),
	"item_id" varchar(20) NOT NULL,
	"supplier_id" uuid,
	"quantity_detail_transaction" integer NOT NULL,
	"quantity_check" integer,
	"quantity_difference" integer,
	"status_detail_transaction" "status_transaction" DEFAULT 'PENDING' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_movement" (
	"id_movement" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_id" varchar(20) NOT NULL,
	"type_movement" "type_movement" DEFAULT 'IN' NOT NULL,
	"item_id" varchar(20) NOT NULL,
	"quantity_movement" integer NOT NULL,
	"date_exp" date DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "item" (
	"id_item" varchar(20) PRIMARY KEY NOT NULL,
	"name_item" varchar(255) NOT NULL,
	"unit_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"stock_quantity" integer NOT NULL,
	"min_stock" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "item_name_item_unique" UNIQUE("name_item")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id_notifications" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tanggal_notification" date DEFAULT now() NOT NULL,
	"telepon_notification" varchar(20),
	"message_notification" text NOT NULL,
	"status_notification" "status_notification" DEFAULT 'PENDING' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier" (
	"id_supplier" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_name" varchar(225),
	"name_supplier" varchar(225),
	"address_supplier" varchar(225),
	"phone_supplier" varchar(20) NOT NULL,
	CONSTRAINT "supplier_phone_supplier_unique" UNIQUE("phone_supplier")
);
--> statement-breakpoint
CREATE TABLE "transaction" (
	"id_transaction" varchar(20) PRIMARY KEY NOT NULL,
	"type_transaction" "type_transaction" DEFAULT 'IN' NOT NULL,
	"date_transaction" date DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"status_transaction" "status_transaction" DEFAULT 'PENDING' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unit" (
	"id_unit" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_unit" varchar(50) NOT NULL,
	CONSTRAINT "unit_name_unit_unique" UNIQUE("name_unit")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id_user" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_user" varchar(225) NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"role_user" "user_role" DEFAULT 'HEADKITCHEN' NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
ALTER TABLE "detail_transaction" ADD CONSTRAINT "detail_transaction_transaction_id_transaction_id_transaction_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transaction"("id_transaction") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "detail_transaction" ADD CONSTRAINT "detail_transaction_item_id_item_id_item_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id_item") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "detail_transaction" ADD CONSTRAINT "detail_transaction_supplier_id_supplier_id_supplier_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("id_supplier") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_movement" ADD CONSTRAINT "item_movement_transaction_id_transaction_id_transaction_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transaction"("id_transaction") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_movement" ADD CONSTRAINT "item_movement_item_id_item_id_item_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id_item") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_unit_id_unit_id_unit_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."unit"("id_unit") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_category_id_category_id_category_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id_category") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_user_id_user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id_user") ON DELETE cascade ON UPDATE cascade;
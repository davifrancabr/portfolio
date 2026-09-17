CREATE TYPE "inventory_movement_type" AS ENUM('entrada', 'saida', 'ajuste');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"user_id" text,
	"product_id" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"favorited_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "favorites_pkey" PRIMARY KEY("user_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"storage_id" text,
	"product_id" text,
	"quantity" integer DEFAULT 0 NOT NULL,
	"minimum_quantity" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_pkey" PRIMARY KEY("storage_id","product_id"),
	CONSTRAINT "inventory_quantity_nonneg" CHECK ("quantity" >= 0),
	CONSTRAINT "inventory_minimum_quantity_nonneg" CHECK ("minimum_quantity" >= 0)
);
--> statement-breakpoint
CREATE TABLE "inventory_movement" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"storage_id" text NOT NULL,
	"product_id" text NOT NULL,
	"type" "inventory_movement_type" NOT NULL,
	"quantity_before" integer NOT NULL,
	"quantity" integer NOT NULL,
	"quantity_after" integer NOT NULL,
	"reason" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_movements_quantity_before_positive" CHECK ("quantity_before" > 0),
	CONSTRAINT "inventory_movements_quantity_positive" CHECK ("quantity" >= 0),
	CONSTRAINT "inventory_movements_quantity_after_positive" CHECK ("quantity_after" >= 0)
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"description" text,
	"sku" text NOT NULL,
	"cost_price" numeric(12,2) NOT NULL,
	"sale_price" numeric(12,2) NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text
);
--> statement-breakpoint
CREATE TABLE "storages" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"address" text NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"username" text UNIQUE,
	"display_username" text,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX "favorites_user_id_idx" ON "favorites" ("user_id");--> statement-breakpoint
CREATE INDEX "favorites_product_id_idx" ON "favorites" ("product_id");--> statement-breakpoint
CREATE INDEX "favorites_product_favorited_at_idx" ON "favorites" ("product_id","favorited_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "inventory_product_id_idx" ON "inventory" ("product_id");--> statement-breakpoint
CREATE INDEX "inventory_storage_id_idx" ON "inventory" ("storage_id");--> statement-breakpoint
CREATE INDEX "inventory_movements_storage_product_occurred_idx" ON "inventory_movement" ("storage_id","product_id","occurred_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "inventory_movements_user_occurred_idx" ON "inventory_movement" ("user_id","occurred_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "products_sku_uidx" ON "products" ("sku");--> statement-breakpoint
CREATE INDEX "products_deleted_at_idx" ON "products" ("deleted_at");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "storages_address_uidx" ON "storages" ("address");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_storage_id_storages_id_fkey" FOREIGN KEY ("storage_id") REFERENCES "storages"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movements_inventory_fk" FOREIGN KEY ("storage_id","product_id") REFERENCES "inventory"("storage_id","product_id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
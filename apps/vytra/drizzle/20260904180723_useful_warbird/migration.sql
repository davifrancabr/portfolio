CREATE TYPE "inventory_movement_type" AS ENUM('entrada', 'saida', 'ajuste');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"issuer" text NOT NULL,
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
	"criadoEm" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizadoEm" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"userId" text,
	"productId" text,
	"isPublic" boolean DEFAULT true NOT NULL,
	"favoritedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "favorites_pkey" PRIMARY KEY("userId","productId")
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"storageId" text,
	"productId" text,
	"quantity" integer DEFAULT 0 NOT NULL,
	"minimumQuantity" integer DEFAULT 0 NOT NULL,
	"criadoEm" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizadoEm" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_pkey" PRIMARY KEY("storageId","productId"),
	CONSTRAINT "inventory_quantity_nonneg" CHECK ("quantity" >= 0),
	CONSTRAINT "inventory_minimum_quantity_nonneg" CHECK ("minimumQuantity" >= 0)
);
--> statement-breakpoint
CREATE TABLE "inventory_movements" (
	"id" text PRIMARY KEY,
	"userId" text NOT NULL,
	"storageId" text NOT NULL,
	"productId" text NOT NULL,
	"type" "inventory_movement_type" NOT NULL,
	"quantityBefore" integer NOT NULL,
	"quantity" integer NOT NULL,
	"quantityAfter" integer NOT NULL,
	"reason" text,
	"occurredAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_movements_quantity_positive" CHECK ("quantity" > 0),
	CONSTRAINT "inventory_movements_quantity_before_nonneg" CHECK ("quantityBefore" >= 0),
	CONSTRAINT "inventory_movements_quantity_after_nonneg" CHECK ("quantityAfter" >= 0)
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"description" text,
	"sku" text NOT NULL,
	"costPrice" numeric(12,2) NOT NULL,
	"salePrice" numeric(12,2) NOT NULL,
	"deletedAt" timestamp with time zone,
	"criadoEm" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizadoEm" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL UNIQUE,
	"criadoEm" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizadoEm" timestamp with time zone DEFAULT now() NOT NULL,
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
	"criadoEm" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizadoEm" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp with time zone,
	"username" text NOT NULL UNIQUE,
	"displayUsername" text,
	"criadoEm" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizadoEm" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"criadoEm" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizadoEm" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "account_issuer_accountId_uidx" ON "account" ("issuer","account_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX "favorites_user_id_idx" ON "favorites" ("userId");--> statement-breakpoint
CREATE INDEX "favorites_product_id_idx" ON "favorites" ("productId");--> statement-breakpoint
CREATE INDEX "favorites_product_favorited_at_idx" ON "favorites" ("productId","favoritedAt" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "inventory_product_id_idx" ON "inventory" ("productId");--> statement-breakpoint
CREATE INDEX "inventory_storage_id_idx" ON "inventory" ("storageId");--> statement-breakpoint
CREATE INDEX "inventory_movements_storage_product_occurred_idx" ON "inventory_movements" ("storageId","productId","occurredAt" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "inventory_movements_user_occurred_idx" ON "inventory_movements" ("userId","occurredAt" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "products_sku_uidx" ON "products" ("sku");--> statement-breakpoint
CREATE INDEX "products_deleted_at_idx" ON "products" ("deletedAt");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "storages_address_uidx" ON "storages" ("address");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_productId_products_id_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_storageId_storages_id_fkey" FOREIGN KEY ("storageId") REFERENCES "storages"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_productId_products_id_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_userId_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_inventory_fk" FOREIGN KEY ("storageId","productId") REFERENCES "inventory"("storageId","productId") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
CREATE TYPE "media_category_type" AS ENUM('serie', 'movie', 'music', 'video', 'podcast', 'book');--> statement-breakpoint
CREATE TYPE "media_type_status" AS ENUM('on_going', 'completed', 'scheduled', 'dropped');--> statement-breakpoint
CREATE TYPE "watchlist_status" AS ENUM('watched', 'dropped', 'not_watched');--> statement-breakpoint
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
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_categories" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"type" "media_category_type" DEFAULT 'movie'::"media_category_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_items" (
	"id" text PRIMARY KEY,
	"media_id" text NOT NULL,
	"name" text NOT NULL,
	"media_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_theme" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"type" "media_category_type" DEFAULT 'movie'::"media_category_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_to_categories" (
	"media_id" text,
	"category_id" text,
	CONSTRAINT "media_to_categories_pkey" PRIMARY KEY("media_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "media_to_themes" (
	"media_id" text,
	"theme_id" text,
	CONSTRAINT "media_to_themes_pkey" PRIMARY KEY("media_id","theme_id")
);
--> statement-breakpoint
CREATE TABLE "medias" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"description" text,
	"status" "media_type_status" DEFAULT 'on_going'::"media_type_status" NOT NULL,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
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
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watchlist_items" (
	"id" text PRIMARY KEY,
	"watchlist_id" text NOT NULL,
	"media_id" text NOT NULL,
	"status" "watchlist_status" DEFAULT 'not_watched'::"watchlist_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watchlists" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"name" text DEFAULT 'Favorites' NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"share_token" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_categories_name_uidx" ON "media_categories" ("name");--> statement-breakpoint
CREATE INDEX "media_categories_type_idx" ON "media_categories" ("type");--> statement-breakpoint
CREATE INDEX "media_items_media_idx" ON "media_items" ("media_id");--> statement-breakpoint
CREATE INDEX "media_items_name_idx" ON "media_items" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "media_theme_name_uidx" ON "media_theme" ("name");--> statement-breakpoint
CREATE INDEX "media_theme_type_idx" ON "media_theme" ("type");--> statement-breakpoint
CREATE INDEX "medias_tags_idx" ON "medias" ("tags");--> statement-breakpoint
CREATE INDEX "medias_status_idx" ON "medias" ("status");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "watchlist_items_watchlist_media_idx" ON "watchlist_items" ("watchlist_id","media_id");--> statement-breakpoint
CREATE INDEX "watchlist_items_media_idx" ON "watchlist_items" ("media_id");--> statement-breakpoint
CREATE INDEX "watchlist_items_status_idx" ON "watchlist_items" ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "watchlists_share_token_uidx" ON "watchlists" ("share_token");--> statement-breakpoint
CREATE INDEX "watchlists_user_idx" ON "watchlists" ("user_id");--> statement-breakpoint
CREATE INDEX "watchlists_public_idx" ON "watchlists" ("user_id","is_public");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_media_id_medias_id_fkey" FOREIGN KEY ("media_id") REFERENCES "medias"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "media_to_categories" ADD CONSTRAINT "media_to_categories_media_id_medias_id_fkey" FOREIGN KEY ("media_id") REFERENCES "medias"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "media_to_categories" ADD CONSTRAINT "media_to_categories_category_id_media_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "media_categories"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "media_to_themes" ADD CONSTRAINT "media_to_themes_media_id_medias_id_fkey" FOREIGN KEY ("media_id") REFERENCES "medias"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "media_to_themes" ADD CONSTRAINT "media_to_themes_theme_id_media_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "media_theme"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "watchlist_items" ADD CONSTRAINT "watchlist_items_watchlist_id_watchlists_id_fkey" FOREIGN KEY ("watchlist_id") REFERENCES "watchlists"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "watchlist_items" ADD CONSTRAINT "watchlist_items_media_id_medias_id_fkey" FOREIGN KEY ("media_id") REFERENCES "medias"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "watchlists" ADD CONSTRAINT "watchlists_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
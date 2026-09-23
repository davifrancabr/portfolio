ALTER TABLE "user" ADD COLUMN "payment_customer_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "accepts_marketing" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "locate" text DEFAULT 'pt-BR' NOT NULL;
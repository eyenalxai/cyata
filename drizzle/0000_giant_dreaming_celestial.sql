CREATE TABLE IF NOT EXISTS "sessions" (
	"key" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"user_uuid" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"username" text NOT NULL,
	"password_hash" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

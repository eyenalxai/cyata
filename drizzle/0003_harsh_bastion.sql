CREATE TABLE IF NOT EXISTS "user_preferences" (
	"user_uuid" uuid PRIMARY KEY NOT NULL,
	"default_model" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

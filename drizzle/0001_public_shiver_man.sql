CREATE TABLE IF NOT EXISTS "allowed_usernames" (
	"username" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"note" text NOT NULL,
	"telegram_username" text
);

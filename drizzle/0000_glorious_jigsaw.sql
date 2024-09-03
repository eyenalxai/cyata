CREATE TABLE IF NOT EXISTS "users" (
	"uuid" uuid DEFAULT gen_random_uuid(),
	"username" text NOT NULL,
	"password_hash" text NOT NULL
);

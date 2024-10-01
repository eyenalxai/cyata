import "server-only"
import { env } from "@/lib/env.mjs"
import * as schema from "@/lib/schema"
import { buildDatabaseUrl } from "@/lib/utils"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const pool = postgres(
	buildDatabaseUrl({
		user: env.POSTGRES_USER,
		password: env.POSTGRES_PASSWORD,
		address: env.POSTGRES_PASSWORD,
		database: env.POSTGRES_DB
	}),
	{ max: 10 }
)

export const db = drizzle(pool, { schema })

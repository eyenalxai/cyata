import "server-only"
import { env } from "@/lib/env.mjs"
import * as schema from "@/lib/schema"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const pool = postgres(env.DATABASE_URL, { max: 10 })

export const db = drizzle(pool, { schema })

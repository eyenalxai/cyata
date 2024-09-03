import { sql } from "drizzle-orm"
import { pgTable, text, uuid } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
	uuid: uuid("uuid").default(sql`gen_random_uuid()`),
	username: text("username").notNull(),
	passwordHash: text("password_hash").notNull()
})

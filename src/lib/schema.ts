import { relations, sql } from "drizzle-orm"
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
	uuid: uuid("uuid").default(sql`gen_random_uuid()`).primaryKey(),
	createdAt: timestamp("created_at").default(sql`now()`),
	username: text("username").notNull(),
	passwordHash: text("password_hash").notNull()
})

export type User = typeof users.$inferSelect
export type UserInsert = typeof users.$inferInsert

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions)
}))

export const sessions = pgTable("sessions", {
	key: text("key").primaryKey(),
	expiresAt: timestamp("expires_at", { mode: "string", withTimezone: true }).notNull(),
	userUuid: uuid("user_uuid")
		.references(() => users.uuid, { onDelete: "cascade" })
		.notNull()
})

export type Session = typeof sessions.$inferSelect
export type SessionInsert = typeof sessions.$inferInsert

export const sessionsRelations = relations(sessions, ({ one }) => ({
	author: one(users, {
		fields: [sessions.userUuid],
		references: [users.uuid]
	})
}))

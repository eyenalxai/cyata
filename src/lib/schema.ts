import type { AiMessageRole } from "@/lib/zod/ai-message"
import type { OpenAIModel } from "@/lib/zod/model"
import { relations, sql } from "drizzle-orm"
import { pgTable, real, serial, text, timestamp, uuid } from "drizzle-orm/pg-core"
import type { z } from "zod"

export const users = pgTable("users", {
	uuid: uuid("uuid").default(sql`gen_random_uuid()`).primaryKey(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
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
	user: one(users, {
		fields: [sessions.userUuid],
		references: [users.uuid]
	})
}))

export const chats = pgTable("chats", {
	uuid: uuid("uuid").primaryKey(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	model: text("model").$type<z.infer<typeof OpenAIModel>>().notNull(),
	userUuid: uuid("user_uuid")
		.references(() => users.uuid, { onDelete: "cascade" })
		.notNull()
})

export type Chat = typeof chats.$inferSelect
export type ChatInsert = typeof chats.$inferInsert

export const chatsRelations = relations(chats, ({ one, many }) => ({
	user: one(users, {
		fields: [chats.userUuid],
		references: [users.uuid]
	}),
	messages: many(messages, { relationName: "chatMessages" }),
	usages: many(usages, { relationName: "chatUsages" })
}))

export const messages = pgTable("messages", {
	uuid: uuid("uuid").default(sql`gen_random_uuid()`).primaryKey(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	role: text("role").$type<z.infer<typeof AiMessageRole>>().notNull(),
	content: text("content").notNull(),
	chatUuid: uuid("chat_uuid")
		.references(() => chats.uuid, { onDelete: "cascade" })
		.notNull()
})

export type Message = typeof messages.$inferSelect
export type MessageInsert = typeof messages.$inferInsert

export const messagesRelations = relations(messages, ({ one }) => ({
	chat: one(chats, {
		fields: [messages.chatUuid],
		references: [chats.uuid],
		relationName: "chatMessages"
	})
}))

export const userPreferences = pgTable("user_preferences", {
	userUuid: uuid("user_uuid")
		.references(() => users.uuid, { onDelete: "cascade" })
		.primaryKey(),
	defaultModel: text("default_model").$type<z.infer<typeof OpenAIModel>>().notNull(),
	systemPrompt: text("system_prompt").default("You're a helpful assistant").notNull()
})

export type UserPreferences = typeof userPreferences.$inferSelect
export type UserPreferencesInsert = typeof userPreferences.$inferInsert

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
	user: one(users, {
		fields: [userPreferences.userUuid],
		references: [users.uuid]
	})
}))

export const usages = pgTable("usages", {
	id: serial("id").primaryKey(),
	createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).default(sql`now()`).notNull(),
	userUuid: uuid("user_uuid").references(() => users.uuid, { onDelete: "cascade" }),
	usage: real("usage").notNull()
})

export type Usage = typeof usages.$inferSelect
export type UsageInsert = typeof usages.$inferInsert

export const usagesRelations = relations(usages, ({ one }) => ({
	user: one(users, {
		fields: [usages.userUuid],
		references: [users.uuid],
		relationName: "chatUsages"
	})
}))

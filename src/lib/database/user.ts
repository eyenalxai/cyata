import { db } from "@/lib/database/client"
import { getErrorMessage } from "@/lib/error-message"
import { type UserInsert, users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { ResultAsync, errAsync, okAsync } from "neverthrow"

export const insertUser = (user: UserInsert) => {
	return ResultAsync.fromPromise(db.insert(users).values(user).returning(), (e) =>
		getErrorMessage(e, "Failed to insert user")
	).map(([insertedPaste]) => insertedPaste)
}

export const existsUserByUsername = (username: string) =>
	ResultAsync.fromPromise(db.select().from(users).where(eq(users.username, username)), (e) =>
		getErrorMessage(e, "Failed to check if user exists")
	).map((users) => users.length > 0)

export const getUserByUsername = (username: string) => {
	return ResultAsync.fromPromise(db.select().from(users).where(eq(users.username, username)), (e) =>
		getErrorMessage(e, "Failed to get user by username")
	).andThen((users) => (users.length > 0 ? okAsync(users[0]) : errAsync("User not found")))
}

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

export const selectUserByUsername = (username: string) => {
	return ResultAsync.fromPromise(db.select().from(users).where(eq(users.username, username)), (e) =>
		getErrorMessage(e, "Failed to select user by username")
	)
		.andThen((users) => (users.length > 0 ? okAsync(users[0]) : errAsync("User not found")))
		.andThen((user) => {
			if (user.isRestricted) return errAsync("You're restricted")
			return okAsync(user)
		})
}

export const selectUserByUuid = (uuid: string) => {
	return ResultAsync.fromPromise(db.select().from(users).where(eq(users.uuid, uuid)), (e) =>
		getErrorMessage(e, "Failed to select user by uuid")
	)
		.andThen((users) => (users.length > 0 ? okAsync(users[0]) : errAsync("User not found")))
		.andThen((user) => {
			if (user.isRestricted) return errAsync("You're restricted")
			return okAsync(user)
		})
}

export const selectAllUsers = () => {
	return ResultAsync.fromPromise(db.select().from(users), (e) => getErrorMessage(e, "Failed to select all users")).map(
		(users) => users
	)
}

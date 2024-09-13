import { db } from "@/lib/database/client"
import { getErrorMessage } from "@/lib/error-message"
import { type AllowedUsernameInsert, allowedUsernames } from "@/lib/schema"
import { asc, eq } from "drizzle-orm"
import { ResultAsync, errAsync, okAsync } from "neverthrow"

export const existsAllowedUsername = (username: string) =>
	ResultAsync.fromPromise(db.select().from(allowedUsernames).where(eq(allowedUsernames.username, username)), (e) =>
		getErrorMessage(e, "Failed to check if allowed username exists")
	).andThen((allowedUsername) => {
		if (allowedUsername.length > 0) return okAsync(allowedUsername[0])
		return errAsync("Username not allowed")
	})

export const selectAllowedUsernames = () =>
	ResultAsync.fromPromise(db.select().from(allowedUsernames).orderBy(asc(allowedUsernames.username)), (e) =>
		getErrorMessage(e, "Failed to select allowed usernames")
	)

export const insertAllowedUsername = (allowedUsername: AllowedUsernameInsert) => {
	return ResultAsync.fromPromise(db.insert(allowedUsernames).values(allowedUsername), (e) =>
		getErrorMessage(e, "Failed to insert allowed username")
	)
}

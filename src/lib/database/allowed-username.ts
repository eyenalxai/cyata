import { db } from "@/lib/database/client"
import { getErrorMessage } from "@/lib/error-message"
import { allowedUsernames } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { ResultAsync, errAsync, okAsync } from "neverthrow"

export const existsAllowedUsername = (username: string) =>
	ResultAsync.fromPromise(db.select().from(allowedUsernames).where(eq(allowedUsernames.username, username)), (e) =>
		getErrorMessage(e, "Failed to check if allowed username exists")
	).andThen((allowedUsername) => {
		if (allowedUsername.length > 0) return okAsync(allowedUsername[0])
		return errAsync("Username not allowed")
	})

import { db } from "@/lib/database/client"
import { getErrorMessage } from "@/lib/error-message"
import { type SessionInsert, sessions } from "@/lib/schema"
import { getSessionExpiryDate, isSessionExpired } from "@/lib/session"
import { eq } from "drizzle-orm"
import { ResultAsync, errAsync, okAsync } from "neverthrow"

export const insertSession = (session: Omit<SessionInsert, "expiresAt">) => {
	return ResultAsync.fromPromise(
		db
			.insert(sessions)
			.values({
				key: session.key,
				userUuid: session.userUuid,
				expiresAt: getSessionExpiryDate()
			})
			.returning(),
		(e) => getErrorMessage(e, "Failed to insert session")
	).map(([insertedSession]) => insertedSession)
}

export const selectSessionByKey = (key: string) => {
	return ResultAsync.fromPromise(db.select().from(sessions).where(eq(sessions.key, key)), (e) =>
		getErrorMessage(e, "Failed to get session by key")
	)
		.andThen((sessions) => (sessions.length > 0 ? okAsync(sessions[0]) : errAsync("Session not found")))
		.andThen((session) => {
			if (isSessionExpired(session)) return errAsync("Session expired")
			return okAsync(session)
		})
}

export const updateSessionExpiration = (session: Omit<SessionInsert, "expiresAt">) => {
	return ResultAsync.fromPromise(
		db
			.update(sessions)
			.set({
				key: session.key,
				userUuid: session.userUuid,
				expiresAt: getSessionExpiryDate()
			})
			.where(eq(sessions.key, session.key))
			.returning(),
		(e) => getErrorMessage(e, "Failed to update session")
	).map(([updatedSession]) => updatedSession)
}

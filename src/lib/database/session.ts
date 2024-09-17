import type { db } from "@/lib/database/client"
import { getErrorMessage } from "@/lib/error-message"
import { type SessionInsert, sessions } from "@/lib/schema"
import { getSessionExpiryDate, isSessionExpired } from "@/lib/session"
import { eq } from "drizzle-orm"
import { ResultAsync, errAsync, okAsync } from "neverthrow"

export const insertSession = (tx: typeof db, session: Omit<SessionInsert, "expiresAt">) =>
	ResultAsync.fromPromise(
		tx
			.insert(sessions)
			.values({
				key: session.key,
				userUuid: session.userUuid,
				expiresAt: getSessionExpiryDate()
			})
			.returning(),
		(e) => getErrorMessage(e, "Failed to insert session")
	).map(([insertedSession]) => insertedSession)

export const selectSessionByKey = (tx: typeof db, key: string) =>
	ResultAsync.fromPromise(tx.select().from(sessions).where(eq(sessions.key, key)), (e) =>
		getErrorMessage(e, "Failed to select session by key")
	)
		.andThen((sessions) => (sessions.length > 0 ? okAsync(sessions[0]) : errAsync("Session not found")))
		.andThen((session) => {
			if (isSessionExpired(session)) return errAsync("Session expired")
			return okAsync(session)
		})

export const updateSessionExpiration = (tx: typeof db, session: Omit<SessionInsert, "expiresAt">) =>
	ResultAsync.fromPromise(
		tx
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

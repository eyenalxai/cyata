import type { db } from "@/lib/database/client"
import { env } from "@/lib/env.mjs"
import { getErrorMessage } from "@/lib/error-message"
import { type SessionInsert, sessions } from "@/lib/schema"
import { isSessionExpired } from "@/lib/session"
import { eq } from "drizzle-orm"
import { ResultAsync, errAsync, okAsync } from "neverthrow"

export const insertSession = (trx: typeof db, session: SessionInsert) => {
	return ResultAsync.fromPromise(trx.insert(sessions).values(session).returning(), (e) =>
		getErrorMessage(e, "Failed to insert session")
	).map(([insertedSession]) => insertedSession)
}

export const selectSessionByKey = (trx: typeof db, key: string) => {
	return ResultAsync.fromPromise(trx.select().from(sessions).where(eq(sessions.key, key)), (e) =>
		getErrorMessage(e, "Failed to get session by key")
	)
		.andThen((sessions) => (sessions.length > 0 ? okAsync(sessions[0]) : errAsync("Session not found")))
		.andThen((session) => {
			if (isSessionExpired(session)) return errAsync("Session expired")
			return okAsync(session)
		})
}

export const updateSessionExpiration = (trx: typeof db, session: Omit<SessionInsert, "expiresAt">) => {
	return ResultAsync.fromPromise(
		trx
			.update(sessions)
			.set({
				key: session.key,
				userUuid: session.userUuid,
				expiresAt: new Date(
					Date.now() + 1000 * 60 * 60 * 24 * env.SESSION_COOKIES_EXPIRES_IN_DAYS - 1000 * 60 * 5
				).toISOString() // 5 minutes before cookie expires
			})
			.where(eq(sessions.key, session.key))
			.returning(),
		(e) => getErrorMessage(e, "Failed to update session")
	).map(([updatedSession]) => updatedSession)
}

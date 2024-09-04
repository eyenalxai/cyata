import "server-only"
import { getSessionKey } from "@/lib/cookie"
import { db } from "@/lib/database/client"
import { selectSessionByKey, updateSessionExpiration } from "@/lib/database/session"
import { selectUserByUuid } from "@/lib/database/user"
import type { Session } from "@/lib/schema"
import { okAsync } from "neverthrow"

export const isSessionExpired = (session: Session) => new Date(session.expiresAt) < new Date()

export const isSessionExpiresSoon = (session: Session) => {
	const expiresAt = new Date(session.expiresAt)
	return expiresAt < new Date(Date.now() + 1000 * 60 * 60 * 24 * 10) // 10 days before session expires
}

export const getSession = async () => {
	return await db.transaction(async (trx) => {
		return getSessionKey().asyncAndThen((sessionKey) =>
			selectSessionByKey(trx, sessionKey)
				.andThen((session) => {
					if (isSessionExpiresSoon(session)) {
						return updateSessionExpiration(trx, {
							key: session.key,
							userUuid: session.userUuid
						})
					}

					return okAsync(session)
				})
				.andThen((session) => selectUserByUuid(trx, session.userUuid))
		)
	})
}

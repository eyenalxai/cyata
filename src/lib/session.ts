import "server-only"
import { getSessionKey } from "@/lib/cookie"
import { selectSessionByKey, updateSessionExpiration } from "@/lib/database/session"
import { selectUserByUuid } from "@/lib/database/user"
import { env } from "@/lib/env.mjs"
import type { Session } from "@/lib/schema"
import { okAsync } from "neverthrow"

export const isSessionExpired = (session: Session) => new Date(session.expiresAt) < new Date()

export const isSessionExpiresSoon = (session: Session) => {
	const expiresAt = new Date(session.expiresAt)
	return expiresAt < new Date(Date.now() + 1000 * 60 * 60 * 24 * 10) // 10 days before session expires
}

export const getSession = async () => {
	return getSessionKey().asyncAndThen((sessionKey) =>
		selectSessionByKey(sessionKey)
			.andThen((session) => {
				if (isSessionExpiresSoon(session)) {
					return updateSessionExpiration({
						key: session.key,
						userUuid: session.userUuid
					})
				}

				return okAsync(session)
			})
			.andThen((session) => selectUserByUuid(session.userUuid))
	)
}

export const getSessionExpiryDate = () =>
	new Date(Date.now() + 1000 * 60 * 60 * 24 * env.SESSION_COOKIES_EXPIRES_IN_DAYS - 1000 * 60 * 5).toISOString() // 5 minutes before cookie expires

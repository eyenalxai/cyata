import { env } from "@/lib/env.mjs"
import { err, ok } from "neverthrow"
import { cookies } from "next/headers"

export const getSessionKey = () => {
	const cookieStore = cookies()
	const sessionKey = cookieStore.get(env.SESSION_COOKIE_NAME)
	if (!sessionKey) return err("No session cookie found")
	return ok(sessionKey.value)
}

export const setSessionKey = (sessionKey: string) => {
	const cookieStore = cookies()
	cookieStore.set(env.SESSION_COOKIE_NAME, sessionKey, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * env.SESSION_COOKIES_EXPIRES_IN_DAYS)
	})
}

export const clearSessionKey = () => {
	const cookieStore = cookies()
	cookieStore.delete(env.SESSION_COOKIE_NAME)
}

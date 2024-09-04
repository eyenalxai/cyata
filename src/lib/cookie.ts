import { env } from "@/lib/env.mjs"
import { err, ok } from "neverthrow"
import { cookies } from "next/headers"

export const getSessionKey = () => {
	const cookieStore = cookies()
	const sessionKey = cookieStore.get(env.SESSION_COOKIE_NAME)
	if (!sessionKey) return err("No session cookie found")
	return ok(sessionKey.value)
}

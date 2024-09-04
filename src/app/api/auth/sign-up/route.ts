import { setSessionKey } from "@/lib/cookie"
import { hashPassword } from "@/lib/crypto/password"
import { secureRandomToken } from "@/lib/crypto/token"
import { insertSession } from "@/lib/database/session"
import { existsUserByUsername, insertUser } from "@/lib/database/user"
import { env } from "@/lib/env.mjs"
import { AuthFormSchema } from "@/lib/zod/form/auth"
import { parseZodSchema } from "@/lib/zod/parse"
import { err, ok } from "neverthrow"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
	return parseZodSchema(AuthFormSchema, await request.json())
		.asyncAndThen((signUpData) =>
			existsUserByUsername(signUpData.username)
				.map((userExists) => ({ signUpData, userExists }))
				.andThen(({ signUpData, userExists }) => {
					if (userExists) return err("User already exists")
					return ok(signUpData)
				})
				.andThen((signUpData) => hashPassword(signUpData.password))
				.map((passwordHash) => ({ signUpData, passwordHash }))
				.andThen(({ signUpData, passwordHash }) => insertUser({ username: signUpData.username, passwordHash }))
				.andThen((insertedUser) =>
					insertSession({
						key: secureRandomToken(),
						expiresAt: new Date(
							Date.now() + 1000 * 60 * 60 * 24 * env.SESSION_COOKIES_EXPIRES_IN_DAYS - 1000 * 60 * 5
						).toISOString(), // 5 minutes before cookie expires
						userUuid: insertedUser.uuid
					})
				)
				.map((insertedSession) => setSessionKey(insertedSession.key))
		)
		.match(
			() => new NextResponse("User created", { status: 201 }),
			(error) => new NextResponse(error, { status: 400 })
		)
}

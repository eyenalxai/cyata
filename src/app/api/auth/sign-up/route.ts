import { setSessionKey } from "@/lib/cookie"
import { hashPassword } from "@/lib/crypto/password"
import { secureRandomToken } from "@/lib/crypto/token"
import { existsAllowedUsername } from "@/lib/database/allowed-username"
import { db } from "@/lib/database/client"
import { insertSession } from "@/lib/database/session"
import { existsUserByUsername, insertUser } from "@/lib/database/user"
import { insertUserPreferences } from "@/lib/database/user-preferences"
import { validateCaptcha } from "@/lib/fetch/captcha"
import { AuthFormSchema } from "@/lib/zod/form/auth"
import { defaultModel } from "@/lib/zod/model"
import { parseZodSchema } from "@/lib/zod/parse"
import { err, ok } from "neverthrow"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
	return await db.transaction(async (tx) =>
		parseZodSchema(AuthFormSchema, await request.json())
			.asyncAndThen((signInData) => validateCaptcha(signInData["cf-turnstile-response"]).map(() => signInData))
			.andThen((signUpData) => existsAllowedUsername(tx, signUpData.username).map(() => signUpData))
			.andThen((signUpData) =>
				existsUserByUsername(tx, signUpData.username)
					.map((userExists) => ({ signUpData, userExists }))
					.andThen(({ signUpData, userExists }) => {
						if (userExists) return err("User already exists")
						return ok(signUpData)
					})
					.andThen((signUpData) => hashPassword(signUpData.password))
					.map((passwordHash) => ({ signUpData, passwordHash }))
					.andThen(({ signUpData, passwordHash }) =>
						insertUser(tx, { username: signUpData.username, passwordHash }).andThen((insertedUser) =>
							insertUserPreferences(tx, { userUuid: insertedUser.uuid, defaultModel: defaultModel }).map(
								() => insertedUser
							)
						)
					)
					.andThen((insertedUser) =>
						insertSession(tx, {
							key: secureRandomToken(),
							userUuid: insertedUser.uuid
						})
					)
					.map((insertedSession) => setSessionKey(insertedSession.key))
			)
			.match(
				() => new NextResponse("User created", { status: 201 }),
				(error) => new NextResponse(error, { status: 400 })
			)
	)
}

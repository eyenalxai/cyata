import { setSessionKey } from "@/lib/cookie"
import { verifyPassword } from "@/lib/crypto/password"
import { secureRandomToken } from "@/lib/crypto/token"
import { insertSession } from "@/lib/database/session"
import { selectUserByUsername } from "@/lib/database/user"
import { validateCaptcha } from "@/lib/fetch/captcha"
import { AuthFormSchema } from "@/lib/zod/form/auth"
import { parseZodSchema } from "@/lib/zod/parse"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
	return parseZodSchema(AuthFormSchema, await request.json())
		.asyncAndThen((signInData) => validateCaptcha(signInData["cf-turnstile-response"]).map(() => signInData))
		.andThen((signInData) =>
			selectUserByUsername(signInData.username)
				.map((user) => ({ signInData, user }))
				.andThen(({ signInData, user }) =>
					verifyPassword({ password: signInData.password, hash: user.passwordHash }).map(() => user)
				)
				.andThen((user) =>
					insertSession({
						key: secureRandomToken(),
						userUuid: user.uuid
					})
				)
				.map((insertedSession) => setSessionKey(insertedSession.key))
		)
		.match(
			() => new NextResponse("Signed in", { status: 200 }),
			(error) => new NextResponse(error, { status: 400 })
		)
}

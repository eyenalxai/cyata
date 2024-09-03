import { hashPassword } from "@/lib/crypto/password"
import { secureRandomToken } from "@/lib/crypto/token"
import { insertSession } from "@/lib/database/session"
import { existsUserByUsername, insertUser } from "@/lib/database/user"
import { env } from "@/lib/env.mjs"
import { SignupFormSchema } from "@/lib/zod/form/sign-up"
import { parseZodSchema } from "@/lib/zod/parse"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
	const signUpDataResult = parseZodSchema(SignupFormSchema, await request.json())

	if (signUpDataResult.isErr()) return new NextResponse(signUpDataResult.error, { status: 400 })

	const userExistsResult = await existsUserByUsername(signUpDataResult.value.username)

	if (userExistsResult.isErr()) return new NextResponse(userExistsResult.error, { status: 500 })

	if (userExistsResult.value) return new NextResponse("User already exists", { status: 400 })

	const passwordHash = await hashPassword(signUpDataResult.value.password)

	const insertUserResult = await insertUser({
		username: signUpDataResult.value.username,
		passwordHash: passwordHash
	})

	if (insertUserResult.isErr()) return new NextResponse(insertUserResult.error, { status: 500 })

	const insertSessionResult = await insertSession({
		key: await secureRandomToken(),
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * env.COOKIES_EXPIRES_IN_DAYS - 1000 * 60 * 5).toISOString(), // 5 minutes before cookie expires
		userUuid: insertUserResult.value.uuid
	})

	if (insertSessionResult.isErr()) return new NextResponse(insertSessionResult.error, { status: 500 })

	const cookieStore = cookies()

	cookieStore.set("session", insertSessionResult.value.key, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * env.COOKIES_EXPIRES_IN_DAYS)
	})

	return new NextResponse("User created", { status: 201 })
}

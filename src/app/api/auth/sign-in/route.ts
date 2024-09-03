import { verifyPassword } from "@/lib/crypto/password"
import { secureRandomToken } from "@/lib/crypto/token"
import { insertSession } from "@/lib/database/session"
import { getUserByUsername } from "@/lib/database/user"
import { env } from "@/lib/env.mjs"
import { AuthFormSchema } from "@/lib/zod/form/auth"
import { parseZodSchema } from "@/lib/zod/parse"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
	const signInDataResult = parseZodSchema(AuthFormSchema, await request.json())

	if (signInDataResult.isErr()) return new NextResponse(signInDataResult.error, { status: 400 })

	const userResult = await getUserByUsername(signInDataResult.value.username)

	if (userResult.isErr()) return new NextResponse(userResult.error, { status: 500 })

	const isPasswordValid = await verifyPassword({
		password: signInDataResult.value.password,
		hash: userResult.value.passwordHash
	})

	if (!isPasswordValid) return new NextResponse("Invalid password", { status: 400 })

	const insertSessionResult = await insertSession({
		key: await secureRandomToken(),
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * env.COOKIES_EXPIRES_IN_DAYS - 1000 * 60 * 5).toISOString(), // 5 minutes before cookie expires
		userUuid: userResult.value.uuid
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

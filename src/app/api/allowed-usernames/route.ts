import { getSession } from "@/lib/session"

import { insertAllowedUsername, selectAllowedUsernames } from "@/lib/database/allowed-username"
import { db } from "@/lib/database/client"
import { AllowedUsername, AllowedUsernames } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import { NextResponse } from "next/server"

export async function GET() {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	if (!session.value.isAdmin) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return selectAllowedUsernames(db)
		.andThen((allowedUsernames) => parseZodSchema(AllowedUsernames, allowedUsernames))
		.match(
			(allowedUsernames) => NextResponse.json(allowedUsernames),
			(e) => new NextResponse(e, { status: 400 })
		)
}

export async function POST(request: Request) {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	if (!session.value.isAdmin) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return await db.transaction(async (tx) =>
		parseZodSchema(AllowedUsername, await request.json())
			.asyncAndThen((allowedUsername) => insertAllowedUsername(tx, allowedUsername))
			.match(
				() => new NextResponse("Created", { status: 201 }),
				(e) => new NextResponse(e, { status: 400 })
			)
	)
}

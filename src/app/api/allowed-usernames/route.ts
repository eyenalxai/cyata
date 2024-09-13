import {getSession} from "@/lib/session"

import {selectAllowedUsernames} from "@/lib/database/allowed-username"
import {AllowedUsernames} from "@/lib/zod/api"
import {parseZodSchema} from "@/lib/zod/parse"
import {NextResponse} from "next/server"

export async function GET() {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	if (!session.value.isAdmin) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return selectAllowedUsernames()
		.andThen((allowedUsernames) => parseZodSchema(AllowedUsernames, allowedUsernames))
		.match(
			(allowedUsernames) => NextResponse.json(allowedUsernames),
			(e) => new NextResponse(e, { status: 400 })
		)
}

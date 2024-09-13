import { getSession } from "@/lib/session"

import { updateUserIsRestricted } from "@/lib/database/user"
import { RestrictRequest } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import { NextResponse } from "next/server"

export async function PATCH(request: Request) {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	if (!session.value.isAdmin) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	const oof = await request.json()
	console.log(oof)

	return parseZodSchema(RestrictRequest, oof)
		.asyncAndThen(({ userUuid, isRestricted }) =>
			updateUserIsRestricted(userUuid, isRestricted).map(() => isRestricted)
		)
		.match(
			(isRestricted) => new NextResponse(`User ${isRestricted ? "restricted" : "unrestricted"}`, { status: 200 }),
			(e) => new NextResponse(e, { status: 400 })
		)
}

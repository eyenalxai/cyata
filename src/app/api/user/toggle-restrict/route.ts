import { getSession } from "@/lib/session"

import { db } from "@/lib/database/client"
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

	return await db.transaction(async (tx) =>
		parseZodSchema(RestrictRequest, await request.json())
			.asyncAndThen(({ userUuid, isRestricted }) =>
				updateUserIsRestricted(tx, userUuid, isRestricted).map(() => isRestricted)
			)
			.match(
				(isRestricted) => new NextResponse(`User ${isRestricted ? "restricted" : "unrestricted"}`, { status: 200 }),
				(e) => new NextResponse(e, { status: 400 })
			)
	)
}

import { getSession } from "@/lib/session"

import { db } from "@/lib/database/client"
import { updateDefaultModel } from "@/lib/database/user-preferences"
import { UpdateDefaultModelRequest } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import { NextResponse } from "next/server"

export async function PATCH(request: Request) {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return await db.transaction(async (tx) =>
		parseZodSchema(UpdateDefaultModelRequest, await request.json())
			.asyncAndThen(({ defaultModel }) =>
				updateDefaultModel(tx, {
					userUuid: session.value.uuid,
					defaultModel: defaultModel
				})
			)
			.match(
				() => new NextResponse("Updated default model", { status: 200 }),
				(e) => new NextResponse(e, { status: 400 })
			)
	)
}

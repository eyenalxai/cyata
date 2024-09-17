import { getSession } from "@/lib/session"

import { db } from "@/lib/database/client"
import { updateSystemPrompt } from "@/lib/database/user-preferences"
import { UpdateSystemPromptRequest } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import { NextResponse } from "next/server"

export async function PATCH(request: Request) {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return await db.transaction(async (tx) =>
		parseZodSchema(UpdateSystemPromptRequest, await request.json())
			.asyncAndThen(({ systemPrompt }) =>
				updateSystemPrompt(tx, {
					userUuid: session.value.uuid,
					systemPrompt: systemPrompt
				})
			)
			.match(
				() => new NextResponse("Updated default model", { status: 200 }),
				(e) => new NextResponse(e, { status: 400 })
			)
	)
}

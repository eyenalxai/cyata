import { addMessageToChat } from "@/lib/database/chat"
import { getSession } from "@/lib/session"
import { CompletionRequest } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"

import { db } from "@/lib/database/client"
import { errAsync } from "neverthrow"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return await db.transaction(async (tx) =>
		parseZodSchema(CompletionRequest, await request.json())
			.asyncAndThen(({ messages, chatUuid, model }) => {
				const latestMessage = messages[messages.length - 1]

				if (latestMessage.role === "user") return errAsync("User messages are not allowed in partial completions")

				return addMessageToChat(tx, {
					userUuid: session.value.uuid,
					chatUuid: chatUuid,
					model,
					message: messages[messages.length - 1]
				})
			})
			.match(
				() => new NextResponse("Saved", { status: 200 }),
				(e) => new NextResponse(e, { status: 400 })
			)
	)
}

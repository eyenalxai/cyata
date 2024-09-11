import { addMessageToChat } from "@/lib/database/chat"
import { getSession } from "@/lib/session"
import { CompletionRequest } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"

import { NextResponse } from "next/server"

export async function POST(req: Request) {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return parseZodSchema(CompletionRequest, await req.json())
		.asyncAndThen(({ messages, chatUuid, model }) =>
			addMessageToChat({
				userUuid: session.value.uuid,
				chatUuid: chatUuid,
				model,
				message: messages[messages.length - 1]
			})
		)
		.match(
			() => new NextResponse("Saved", { status: 200 }),
			(e) => new NextResponse(e, { status: 400 })
		)
}

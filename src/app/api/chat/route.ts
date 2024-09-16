import { addMessageToChat } from "@/lib/database/chat"
import { selectUserPreferences } from "@/lib/database/user-preferences"
import { getSession } from "@/lib/session"
import { streamMessage } from "@/lib/stream-message"
import { CompletionRequest } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return parseZodSchema(CompletionRequest, await request.json())
		.asyncAndThen(({ messages, chatUuid, model }) =>
			addMessageToChat({
				userUuid: session.value.uuid,
				chatUuid: chatUuid,
				model,
				message: messages[messages.length - 1]
			})
				.map(() => ({ messages, chatUuid, model }))
				.andThen(({ messages, chatUuid, model }) =>
					selectUserPreferences(session.value.uuid).map((preferences) => ({ messages, chatUuid, model, preferences }))
				)
				.andThen(({ messages, chatUuid, model, preferences }) =>
					streamMessage({
						model,
						systemPrompt: preferences.systemPrompt,
						messages,
						userUuid: session.value.uuid,
						chatUuid
					})
				)
		)
		.match(
			(result) => result.toDataStreamResponse(),
			(e) => new NextResponse(e, { status: 400 })
		)
}

import { addMessageToChat } from "@/lib/database/chat"
import { getSession } from "@/lib/session"
import { CompletionRequest } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import { openai } from "@ai-sdk/openai"
import { convertToCoreMessages, streamText } from "ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return parseZodSchema(CompletionRequest, await req.json())
		.asyncAndThen(({ messages, chatUuid }) =>
			addMessageToChat({
				userUuid: session.value.uuid,
				chatUuid: chatUuid,
				message: messages[messages.length - 1]
			}).map(() => ({ messages, chatUuid }))
		)
		.match(
			async ({ messages, chatUuid }) => {
				const result = await streamText({
					model: openai("gpt-4o-mini"),
					messages: convertToCoreMessages(messages),
					onFinish: ({ text }) => {
						addMessageToChat({
							userUuid: session.value.uuid,
							chatUuid: chatUuid,
							message: {
								role: "assistant",
								content: text
							}
						}).mapErr((e) => new NextResponse(e, { status: 400 }))
					}
				})

				return result.toDataStreamResponse()
			},
			(e) => new NextResponse(e, { status: 400 })
		)
}

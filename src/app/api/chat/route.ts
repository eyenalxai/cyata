import { addMessageToChat } from "@/lib/database/chat"
import { insertUsage } from "@/lib/database/usage"
import { selectUserPreferences } from "@/lib/database/user-preferences"
import { priceMessage, priceMessages } from "@/lib/pricing"
import { getSession } from "@/lib/session"
import type { AiMessageSchema } from "@/lib/zod/ai-message"
import { CompletionRequest } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import { openai } from "@ai-sdk/openai"
import { type CoreMessage, convertToCoreMessages, streamText } from "ai"
import { NextResponse } from "next/server"
import type { z } from "zod"

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
		)
		.match(
			async ({ messages, chatUuid, model, preferences }) => {
				const result = await streamText({
					model: openai(model),
					messages: convertToCoreMessages([
						{
							role: "system",
							content: preferences.systemPrompt
						} satisfies CoreMessage,
						...messages
					]),
					onFinish: ({ text }) => {
						const assistantMessage = {
							role: "assistant",
							content: text
						} satisfies z.infer<typeof AiMessageSchema>

						const inputPrice = priceMessages({
							messages: [
								{
									role: "system",
									content: preferences.systemPrompt
								},
								...messages
							],
							model,
							type: "input"
						})

						const outputPrice = priceMessage({
							message: assistantMessage,
							model,
							type: "output"
						})

						addMessageToChat({
							userUuid: session.value.uuid,
							chatUuid: chatUuid,
							model,
							message: assistantMessage
						})
							.andThen(() =>
								insertUsage({
									userUuid: session.value.uuid,
									usage: inputPrice + outputPrice
								})
							)
							.mapErr((e) => new NextResponse(e, { status: 400 }))
					}
				})

				return result.toDataStreamResponse()
			},
			(e) => new NextResponse(e, { status: 400 })
		)
}

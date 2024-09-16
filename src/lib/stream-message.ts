import {trimMessagesToFitContextWindow} from "@/lib/ai-message"
import {addMessageToChat} from "@/lib/database/chat"
import {insertUsage} from "@/lib/database/usage"
import {getErrorMessage} from "@/lib/error-message"
import {priceMessage, priceMessages} from "@/lib/pricing"
import type {AiMessageSchema, AiMessagesSchema} from "@/lib/zod/ai-message"
import type {OpenAIModel} from "@/lib/zod/model"
import {openai} from "@ai-sdk/openai"
import {convertToCoreMessages, type CoreMessage, streamText} from "ai"
import {ResultAsync} from "neverthrow"
import {NextResponse} from "next/server"
import type {z} from "zod"

type StreamMessageProps = {
	model: z.infer<typeof OpenAIModel>
	systemPrompt: string
	messages: z.infer<typeof AiMessagesSchema>
	userUuid: string
	chatUuid: string
}

export const streamMessage = ({ model, systemPrompt, messages, userUuid, chatUuid }: StreamMessageProps) => {
	const trimmedMessages = trimMessagesToFitContextWindow(messages, model)

	return ResultAsync.fromPromise(
		streamText({
			model: openai(model),
			messages: convertToCoreMessages([
				{
					role: "system",
					content: systemPrompt
				} satisfies CoreMessage,
				...trimmedMessages
			]),
			onFinish: async ({ text }) => {
				const assistantMessage = {
					role: "assistant",
					content: text
				} satisfies z.infer<typeof AiMessageSchema>

				const inputPrice = priceMessages({
					messages: [
						{
							role: "system",
							content: systemPrompt
						},
						...trimmedMessages
					],
					model,
					type: "input"
				})

				const outputPrice = priceMessage({
					message: assistantMessage,
					model,
					type: "output"
				})

				await addMessageToChat({
					userUuid: userUuid,
					chatUuid: chatUuid,
					model,
					message: assistantMessage
				})
					.andThen(() =>
						insertUsage({
							userUuid: userUuid,
							usage: inputPrice + outputPrice
						})
					)
					.mapErr((e) => new NextResponse(e, { status: 400 }))
			}
		}),
		(e) => getErrorMessage(e, "Failed to stream message")
	)
}

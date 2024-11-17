import { selectChatWithMessages, updateChatTitle } from "@/lib/database/chat"
import { getErrorMessage } from "@/lib/error-message"
import { openaiClient } from "@/lib/open-ai"
import type { Transaction } from "@/lib/type-utils"
import { parseZodSchema } from "@/lib/zod/parse"
import { ResultAsync, errAsync, okAsync } from "neverthrow"
import { zodResponseFormat } from "openai/helpers/zod"
import { z } from "zod"

export const TitleResponse = z.object({
	title: z.string()
})

type GenerateChatTitleProps = {
	userMessage: string
	assistantMessage: string
}

export const generateChatTitle = ({ userMessage, assistantMessage }: GenerateChatTitleProps) => {
	return ResultAsync.fromPromise(
		openaiClient.chat.completions.create({
			messages: [
				{
					role: "system",
					content:
						"You need to generate a title for a chat based on user and assistant messages. " +
						"Keep it short, like a headline." +
						"Respond using following json schema: { title: string }"
				},
				{ role: "user", content: userMessage },
				{ role: "assistant", content: assistantMessage }
			],
			model: "gpt-4o-mini",
			response_format: zodResponseFormat(TitleResponse, "title")
		}),
		(e) => getErrorMessage(e, "Failed to generate chat title")
	)
		.andThen((response) => {
			if (response.choices.length === 0) return errAsync("No response from OpenAI")
			return okAsync(response.choices[0].message.content)
		})
		.andThen((json) => {
			if (json === null) return errAsync("Got null response from OpenAI")
			return parseZodSchema(TitleResponse, JSON.parse(json))
		})
		.map((json) => json.title)
}

export const updateEmptyChatTitle = (tx: Transaction, chatUuid: string) =>
	selectChatWithMessages(tx, chatUuid).andThen((chat) => {
		if (!chat.title) {
			const firstUserMessage = chat.messages.find((message) => message.role === "user")
			const firstAssistantMessage = chat.messages.find((message) => message.role === "assistant")

			if (!firstUserMessage || !firstAssistantMessage) return okAsync(chat)

			return generateChatTitle({
				userMessage: firstUserMessage.content,
				assistantMessage: firstAssistantMessage.content
			}).andThen((title) => updateChatTitle(tx, chatUuid, title))
		}

		return okAsync(chat)
	})

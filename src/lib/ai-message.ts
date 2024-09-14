import type { Message as DatabaseMessage } from "@/lib/schema"
import { countTokens } from "@/lib/tokens"
import type { AiMessagesSchema } from "@/lib/zod/ai-message"
import { ModelContextWindows, type OpenAIModel } from "@/lib/zod/model"
import type { Message } from "ai"
import type { z } from "zod"

export const mapMessages: (messages: DatabaseMessage[]) => Message[] = (messages: DatabaseMessage[]) => {
	return messages.map((message) => {
		return {
			id: message.uuid.toString(),
			content: message.content,
			role: message.role.toLowerCase()
		} as Message
	})
}

export const trimMessagesToFitContextWindow = (
	messages: z.infer<typeof AiMessagesSchema>,
	model: z.infer<typeof OpenAIModel>
): z.infer<typeof AiMessagesSchema> => {
	const contextWindow = ModelContextWindows[model]
	let totalTokens = messages.reduce((acc, message) => acc + countTokens(message.content, model), 0)

	if (totalTokens <= contextWindow) {
		return messages
	}

	const trimmedMessages: z.infer<typeof AiMessagesSchema> = messages
	while (totalTokens > contextWindow && trimmedMessages.length > 0) {
		const message = trimmedMessages[0]
		const messageTokens = countTokens(message.content, model)
		totalTokens -= messageTokens
		trimmedMessages.shift()
	}

	return trimmedMessages
}

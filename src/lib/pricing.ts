import { countTokens } from "@/lib/tokens"
import type { AiMessageSchema, AiMessagesSchema } from "@/lib/zod/ai-message"
import { ModelPricing, type OpenAIModel } from "@/lib/zod/model"
import type { z } from "zod"

type PriceMessageProps = {
	message: z.infer<typeof AiMessageSchema>
	model: z.infer<typeof OpenAIModel>
	type: "input" | "output"
}

export const priceMessage = ({ message, model, type }: PriceMessageProps) => {
	const tokens = countTokens(message.content, model)
	const price = ModelPricing[model][type]
	return tokens * price
}

type PriceMessagesProps = {
	messages: z.infer<typeof AiMessagesSchema>
	model: z.infer<typeof OpenAIModel>
	type: "input" | "output"
}

export const priceMessages = ({ messages, model, type }: PriceMessagesProps) => {
	return messages.reduce((total, message) => total + priceMessage({ message, model, type }), 0)
}

import type { AiMessageSchema, AiMessagesSchema } from "@/lib/zod/ai-message"
import { ModelPricing, type OpenAIModel } from "@/lib/zod/model"
import { encode as defaultEncode } from "gpt-tokenizer/model/gpt-4"
import { encode as encode4o } from "gpt-tokenizer/model/gpt-4o"
import type { z } from "zod"

const countTokens = (content: string, model: z.infer<typeof OpenAIModel>) => {
	const encode = model === "gpt-4o" || model === "gpt-4o-mini" ? encode4o : defaultEncode
	return encode(content).length
}

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

import { z } from "zod"

export const AiMessageSchema = z.object({
	role: z.enum(["system", "user", "assistant"]),
	content: z.string()
})

export const AiMessagesSchema = z.array(AiMessageSchema)

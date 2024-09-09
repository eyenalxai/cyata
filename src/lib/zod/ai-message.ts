import { z } from "zod"

export const AiMessageRole = z.enum(["system", "user", "assistant"])

export const AiMessageSchema = z.object({
	role: AiMessageRole,
	content: z.string()
})

export const AiMessagesSchema = z.array(AiMessageSchema)

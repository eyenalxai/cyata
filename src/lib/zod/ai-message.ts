import { z } from "zod"

export const AiMessageRole = z.enum(["function", "system", "user", "assistant", "data", "tool"])

export const AiMessageSchema = z.object({
	role: AiMessageRole,
	content: z.string().trim()
})

export const AiMessagesSchema = z.array(AiMessageSchema)

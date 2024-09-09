import { AiMessagesSchema } from "@/lib/zod/ai-message"
import { z } from "zod"

export const CompletionRequest = z.object({
	messages: AiMessagesSchema,
	chatUuid: z.string()
})

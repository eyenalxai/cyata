import { AiMessagesSchema } from "@/lib/zod/ai-message"
import { z } from "zod"

export const CompletionRequest = z.object({
	messages: AiMessagesSchema,
	chatUuid: z.string().uuid()
})

const ChatResponse = z.object({
	title: z.string(),
	chatUuid: z.string().uuid()
})

export const ChatsResponse = z.array(ChatResponse)

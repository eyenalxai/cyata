import { AiMessagesSchema } from "@/lib/zod/ai-message"
import { OpenAIModel } from "@/lib/zod/model"
import { z } from "zod"

export const CompletionRequest = z.object({
	messages: AiMessagesSchema,
	model: OpenAIModel,
	chatUuid: z.string().uuid()
})

export const ChatInfo = z.object({
	title: z.string().trim(),
	chatUuid: z.string().uuid()
})

export const ChatsResponse = z.array(ChatInfo)

export const SystemPrompt = z.string().trim().min(8).max(4096)

export const PreferencesResponse = z.object({
	userUuid: z.string().uuid(),
	defaultModel: OpenAIModel,
	systemPrompt: SystemPrompt
})

export const UpdateDefaultModelRequest = z.object({
	defaultModel: OpenAIModel
})

export const UpdateSystemPromptRequest = z.object({
	systemPrompt: SystemPrompt
})

export const Usage = z.object({
	usageCurrentMonth: z.number(),
	usagePreviousMonth: z.number(),
	usageTotal: z.number()
})

export const User = z.object({
	username: z.string(),
	isRestricted: z.boolean()
})

export const UsersUsage = z.object({
	user: User,
	usage: Usage
})

export const AllUsersUsage = z.array(UsersUsage)

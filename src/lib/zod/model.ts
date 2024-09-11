import { z } from "zod"

export const OpenAIModel = z.enum(["gpt-4o-mini", "gpt-4-turbo"])

export const selectOpenAiModelOptions: Record<z.infer<typeof OpenAIModel>, string> = {
	"gpt-4o-mini": "GPT-4o mini",
	"gpt-4-turbo": "GPT-4 Turbo"
}

import { z } from "zod"

export const OpenAIModel = z.enum(["gpt-4o", "gpt-4o-mini", "gpt-4", "gpt-4-turbo"])

export const selectOpenAiModelOptions: Record<z.infer<typeof OpenAIModel>, string> = {
	"gpt-4o": "GPT-4o",
	"gpt-4o-mini": "GPT-4o mini",
	"gpt-4": "GPT-4",
	"gpt-4-turbo": "GPT-4 Turbo"
}

export const defaultModel = "gpt-4o-mini" as z.infer<typeof OpenAIModel>

export const Pricing = z.object({
	input: z.number(),
	output: z.number()
})

export const ModelPricing: Record<z.infer<typeof OpenAIModel>, z.infer<typeof Pricing>> = {
	"gpt-4o": {
		input: 5.0 / 1_000_000,
		output: 15.0 / 1_000_000
	},
	"gpt-4o-mini": {
		input: 0.15 / 1_000_000,
		output: 0.6 / 1_000_000
	},
	"gpt-4": {
		input: 30.0 / 1_000_000,
		output: 60.0 / 1_000_000
	},
	"gpt-4-turbo": {
		input: 10.0 / 1_000_000,
		output: 30.0 / 1_000_000
	}
}

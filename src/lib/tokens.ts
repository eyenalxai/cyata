import type { OpenAIModel } from "@/lib/zod/model"
import { encode as defaultEncode } from "gpt-tokenizer/esm/model/gpt-4"
import { encode as encode4o } from "gpt-tokenizer/esm/model/gpt-4o"
import type { z } from "zod"

export const countTokens = (content: string, model: z.infer<typeof OpenAIModel>) => {
	const encode = model === "gpt-4o" || model === "gpt-4o-mini" ? encode4o : defaultEncode
	return encode(content).length
}

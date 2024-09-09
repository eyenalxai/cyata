import { AiMessagesSchema } from "@/lib/zod/llm-message"
import { parseZodSchema } from "@/lib/zod/parse"
import { openai } from "@ai-sdk/openai"
import { convertToCoreMessages, streamText } from "ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
	const { messages } = await req.json()

	const oof = parseZodSchema(AiMessagesSchema, messages)

	if (oof.isErr()) return new NextResponse(oof.error, { status: 400 })

	const result = await streamText({
		model: openai("gpt-4-turbo"),
		messages: convertToCoreMessages(oof.value)
	})

	return result.toDataStreamResponse()
}

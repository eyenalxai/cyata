"use client"

import { mapMessages } from "@/lib/ai-message"
import type { Message } from "@/lib/schema"
import { useChat } from "ai/react"

type ChatProps = {
	uuid: string
	initialMessages: Message[]
}

export const Chat = ({ uuid, initialMessages }: ChatProps) => {
	const { messages, input, handleInputChange, handleSubmit } = useChat({
		initialMessages: mapMessages(initialMessages),
		body: {
			chatUuid: uuid
		}
	})

	return (
		<div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
			<span>{uuid}</span>
			{messages.map((m) => (
				<div key={m.id} className="whitespace-pre-wrap">
					{m.role === "user" ? "User: " : "AI: "}
					{m.content}
				</div>
			))}

			<form onSubmit={handleSubmit}>
				<input
					className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
					value={input}
					placeholder="Say something..."
					onChange={handleInputChange}
				/>
			</form>
		</div>
	)
}

"use client"

import { useChat } from "ai/react"

type ChatProps = {
	uuid: string
}

export const Chat = ({ uuid }: ChatProps) => {
	const { messages, input, handleInputChange, handleSubmit } = useChat({
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

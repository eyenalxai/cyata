"use client"

import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatPanel } from "@/components/chat/chat-panel"
import { ChatScrollAnchor } from "@/components/chat/chat-scroll-anchor"
import { SelectModel } from "@/components/chat/select-model"
import { mapMessages } from "@/lib/ai-message"
import { CHATS_QUERY_KEY } from "@/lib/hooks/fetch/query-keys"
import type { Message } from "@/lib/schema"
import { cn } from "@/lib/utils"
import type { OpenAIModel } from "@/lib/zod/model"
import { useQueryClient } from "@tanstack/react-query"
import { useChat } from "ai/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { z } from "zod"

type ChatProps = {
	chatUuid: string
	initialMessages: Message[]
}

export const Chat = ({ chatUuid, initialMessages }: ChatProps) => {
	const queryClient = useQueryClient()
	const [model, setModel] = useState<z.infer<typeof OpenAIModel>>("gpt-4o-mini")
	const { messages, append, stop, isLoading, input, setInput, error } = useChat({
		initialMessages: mapMessages(initialMessages),
		body: {
			chatUuid: chatUuid,
			model: model
		},
		onResponse: async () => {
			await queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] })
			await queryClient.refetchQueries({ queryKey: [CHATS_QUERY_KEY] })
		}
	})

	useEffect(() => {
		if (error) toast.error(error.message)
	}, [error])

	return (
		<div className={cn("flex", "flex-col", "items-center")}>
			<SelectModel model={model} setModel={setModel} />
			<ChatMessages messages={messages} />
			<ChatScrollAnchor trackVisibility={isLoading} />
			<ChatPanel
				messages={messages}
				chatUuid={chatUuid}
				model={model}
				isLoading={isLoading}
				stop={stop}
				append={append}
				input={input}
				setInput={setInput}
			/>
		</div>
	)
}

"use client"

import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatPanel } from "@/components/chat/chat-panel"
import { ChatScrollAnchor } from "@/components/chat/chat-scroll-anchor"
import { mapMessages } from "@/lib/ai-message"
import { CHATS_QUERY_KEY } from "@/lib/hooks/fetch/query-keys"
import type { Message } from "@/lib/schema"
import { cn } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"
import { useChat } from "ai/react"

type ChatProps = {
	chatUuid: string
	initialMessages: Message[]
}

export const Chat = ({ chatUuid, initialMessages }: ChatProps) => {
	const queryClient = useQueryClient()
	const { messages, append, stop, isLoading, input, setInput } = useChat({
		initialMessages: mapMessages(initialMessages),
		body: {
			chatUuid: chatUuid
		},
		onResponse: async () => {
			await queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] })
			await queryClient.refetchQueries({ queryKey: [CHATS_QUERY_KEY] })
		}
	})

	return (
		<div className={cn("flex", "flex-col", "items-center")}>
			<ChatMessages messages={messages} />
			<ChatScrollAnchor trackVisibility={isLoading} />
			<ChatPanel
				messages={messages}
				chatUuid={chatUuid}
				isLoading={isLoading}
				stop={stop}
				append={append}
				input={input}
				setInput={setInput}
			/>
		</div>
	)
}

"use client"

import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatPanel } from "@/components/chat/chat-panel"
import { ChatScrollAnchor } from "@/components/chat/chat-scroll-anchor"
import { SelectModel } from "@/components/chat/select-model"
import { mapMessages } from "@/lib/ai-message"
import { CHATS_QUERY_KEY, USAGE_QUERY_KEY } from "@/lib/hooks/fetch/query-keys"
import { revalidate } from "@/lib/revalidate-server"
import type { Message } from "@/lib/schema"
import { cn } from "@/lib/utils"
import type { OpenAIModel } from "@/lib/zod/model"
import { useQueryClient } from "@tanstack/react-query"
import { useChat } from "ai/react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import type { z } from "zod"

type ChatProps = {
	chatUuid: string
	initialMessages?: Message[]
	initialModel: z.infer<typeof OpenAIModel>
}

export const Chat = ({ chatUuid, initialMessages, initialModel }: ChatProps) => {
	const queryClient = useQueryClient()
	const [currentInput, setCurrentInput] = useState<string>("")
	const [model, setModel] = useState<z.infer<typeof OpenAIModel>>(initialModel)
	const { messages, append, stop, isLoading, input, setInput, error } = useChat({
		initialMessages: mapMessages(initialMessages || []),
		body: {
			chatUuid: chatUuid,
			model: model
		},
		onResponse: async () => {
			await queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] })
			await queryClient.refetchQueries({ queryKey: [CHATS_QUERY_KEY] })
			await queryClient.invalidateQueries({ queryKey: [USAGE_QUERY_KEY] })
			await queryClient.refetchQueries({ queryKey: [USAGE_QUERY_KEY] })

			setTimeout(async () => {
				await revalidate(`/chat/${chatUuid}`)
			}, 500)
		}
	})

	const inputRef = useRef<HTMLTextAreaElement>(null)
	const prevIsLoadingRef = useRef(isLoading)

	useEffect(() => {
		const prevIsLoading = prevIsLoadingRef.current
		if (messages.length === 2 && prevIsLoading && !isLoading) {
			setTimeout(async () => {
				await queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] })
				await queryClient.refetchQueries({ queryKey: [CHATS_QUERY_KEY] })
			}, 500)
		}
		prevIsLoadingRef.current = isLoading
	}, [messages, isLoading, queryClient])

	useEffect(() => {
		if (error) {
			toast.error(error.message)
			setInput(currentInput)
			inputRef.current?.focus()
		}
	}, [error, currentInput, setInput])

	useEffect(() => {
		if (input && input !== "") {
			setCurrentInput(input)
		}
	}, [input])

	return (
		<div className={cn("flex", "flex-col", "items-center")}>
			<SelectModel model={model} setModel={setModel} />
			<ChatMessages messages={messages} />
			<ChatScrollAnchor trackVisibility={isLoading} />
			<ChatPanel
				isLoading={isLoading}
				stop={stop}
				append={append}
				input={input}
				setInput={setInput}
				messages={messages}
				chatUuid={chatUuid}
				model={model}
				inputRef={inputRef}
			/>
		</div>
	)
}

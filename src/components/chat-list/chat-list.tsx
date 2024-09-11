"use client"

import { ChatLink } from "@/components/chat-list/chat-link"
import { CustomAlert } from "@/components/custom-alert"
import { Loading } from "@/components/loading"
import { useChats } from "@/lib/hooks/fetch/use-chats"
import { cn } from "@/lib/utils"

type ChatListProps = {
	className?: string
}

export const ChatList = ({ className }: ChatListProps) => {
	const { chatsResult, isLoading, deleteChat, isDeletingChat } = useChats()

	if (isLoading) return <Loading />

	if (chatsResult.isErr()) {
		return <CustomAlert>{chatsResult.error}</CustomAlert>
	}

	return (
		<div className={cn("w-full", "flex", "flex-col", "justify-center", "items-center", "gap-y-2", className)}>
			{chatsResult.value.map((chatInfo) => (
				<ChatLink key={chatInfo.chatUuid} chatInfo={chatInfo} deleteChat={deleteChat} isDeletingChat={isDeletingChat} />
			))}
		</div>
	)
}

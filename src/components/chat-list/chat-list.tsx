"use client"

import { ChatGroups } from "@/components/chat-list/chat-groups"
import { CustomAlert } from "@/components/custom-alert"
import { Loading } from "@/components/loading"
import { useChats } from "@/lib/hooks/fetch/use-chats"
import { cn } from "@/lib/utils"

export const ChatList = () => {
	const { chatsResult, isLoading, deleteChat, isDeletingChat } = useChats()

	if (isLoading) return <Loading className={cn("mt-2")} />

	if (chatsResult.isErr()) {
		return <CustomAlert>{chatsResult.error}</CustomAlert>
	}

	return (
		<div className={cn("w-full", "flex", "flex-col", "justify-center", "items-center", "gap-y-2")}>
			<ChatGroups chats={chatsResult.value} deleteChat={deleteChat} isDeletingChat={isDeletingChat} />
		</div>
	)
}

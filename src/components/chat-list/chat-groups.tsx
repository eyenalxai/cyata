import { ChatLink } from "@/components/chat-list/chat-link"
import { cn } from "@/lib/utils"
import type { ChatInfoArray, ChatsResponse } from "@/lib/zod/api"
import type { z } from "zod"

type ChatRowProps = {
	name: string
	chats: z.infer<typeof ChatInfoArray>
	deleteChat: (chatUuid: string) => void
	isDeletingChat: boolean
}

export const ChatRow = ({ name, chats, deleteChat, isDeletingChat }: ChatRowProps) => {
	return (
		<div className={cn("w-full")}>
			<span className={cn("font-semibold", "ml-4", "text-sm")}>{name}</span>
			{chats.map((chatInfo) => (
				<ChatLink key={chatInfo.chatUuid} chatInfo={chatInfo} deleteChat={deleteChat} isDeletingChat={isDeletingChat} />
			))}
		</div>
	)
}

type ChatGroupsProps = {
	chats: z.infer<typeof ChatsResponse>
	deleteChat: (chatUuid: string) => void
	isDeletingChat: boolean
}

export const ChatGroups = ({ chats, deleteChat, isDeletingChat }: ChatGroupsProps) => {
	return (
		<div className={cn("w-full", "space-y-6")}>
			{chats.chatsToday.length > 0 && (
				<ChatRow chats={chats.chatsToday} deleteChat={deleteChat} isDeletingChat={isDeletingChat} name="Today" />
			)}
			{chats.chatsYesterday.length > 0 && (
				<ChatRow
					chats={chats.chatsYesterday}
					deleteChat={deleteChat}
					isDeletingChat={isDeletingChat}
					name="Yesterday"
				/>
			)}
			{chats.chatsThisWeek.length > 0 && (
				<ChatRow chats={chats.chatsThisWeek} deleteChat={deleteChat} isDeletingChat={isDeletingChat} name="This Week" />
			)}
			{chats.chatsThisMonth.length > 0 && (
				<ChatRow
					chats={chats.chatsThisMonth}
					deleteChat={deleteChat}
					isDeletingChat={isDeletingChat}
					name="This Month"
				/>
			)}
			{chats.chatsRest.length > 0 && (
				<ChatRow chats={chats.chatsRest} deleteChat={deleteChat} isDeletingChat={isDeletingChat} name="Older" />
			)}
		</div>
	)
}

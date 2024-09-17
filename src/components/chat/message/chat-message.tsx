import type { Message } from "ai"

import { ChatMessageAvatar } from "@/components/chat/message/chat-message-avatar"
import { ChatMessageContent } from "@/components/chat/message/chat-message-content"
import { cn } from "@/lib/utils"

type ChatMessageProps = {
	message: Message
}

export const ChatMessage = ({ message }: ChatMessageProps) => (
	<div className={cn("group", "relative", "mb-4", "flex", "items-start")}>
		<ChatMessageAvatar message={message} />
		<div className={cn("ml-4", "flex-1", "space-y-2", "overflow-hidden", "px-1")}>
			<ChatMessageContent message={message} />
		</div>
	</div>
)

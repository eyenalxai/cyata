import { ChatMessage } from "@/components/chat/message/chat-message"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Message } from "ai"

type ChatList = {
	messages: Message[]
}

export const ChatMessages = ({ messages }: ChatList) => {
	if (!messages.length || messages.length === 0) {
		return null
	}

	return (
		<div className={cn("w-full", "pb-48", "pt-4")}>
			{messages.map((message, index) => (
				<div key={message.id}>
					<ChatMessage message={message} />
					{index < messages.length - 1 && <Separator className={cn("my-2", "md:my-4")} />}
				</div>
			))}
		</div>
	)
}

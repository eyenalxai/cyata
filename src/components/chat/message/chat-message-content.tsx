import { MarkdownDisplay } from "@/components/markdown"
import type { Message } from "ai"

type ChatMessageContentProps = {
	message: Message
}

export const ChatMessageContent = ({ message }: ChatMessageContentProps) => (
	<MarkdownDisplay markdown={message.content} />
)

import { ArticleWrapper } from "@/components/markdown/article-wrapper"
import { MarkdownDisplay } from "@/components/markdown/markdown-display'"
import type { Message } from "ai"

type ChatMessageContentProps = {
	message: Message
}

export const ChatMessageContent = ({ message }: ChatMessageContentProps) => {
	if (message.role !== "user") return <MarkdownDisplay markdown={message.content} />

	return <ArticleWrapper preserveNewlines>{message.content}</ArticleWrapper>
}

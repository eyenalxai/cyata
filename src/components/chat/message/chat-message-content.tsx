import { ArticleWrapper } from "@/components/markdown/article-wrapper"
import { MemoizedMarkdownDisplay } from "@/components/markdown/markdown-display'"
import type { Message } from "ai"

type ChatMessageContentProps = {
	message: Message
}

export const ChatMessageContent = ({ message }: ChatMessageContentProps) => {
	if (message.role !== "user") return <MemoizedMarkdownDisplay markdown={message.content} />

	return <ArticleWrapper>{message.content}</ArticleWrapper>
}

import { cn } from "@/lib/utils"
import type { Message } from "ai"
import { Bot, User } from "lucide-react"

type ChatMessageAvatarProps = {
	message: Message
}

export const ChatMessageAvatar = ({ message }: ChatMessageAvatarProps) => (
	<div
		className={cn(
			"flex",
			"size-8",
			"shrink-0",
			"select-none",
			"items-center",
			"justify-center",
			"rounded-md",
			"border",
			"shadow",
			message.role === "user" ? "bg-background" : "bg-primary text-primary-foreground"
		)}
	>
		{message.role === "user" ? <User /> : <Bot />}
	</div>
)

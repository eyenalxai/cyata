import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ChatInfo } from "@/lib/zod/api"
import { Trash } from "lucide-react"
import Link from "next/link"
import type { z } from "zod"

type ChatLinkProps = {
	chatInfo: z.infer<typeof ChatInfo>
	deleteChat: (chatUuid: string) => void
	isDeletingChat: boolean
}

export const ChatLink = ({ chatInfo, deleteChat, isDeletingChat }: ChatLinkProps) => {
	return (
		<div className={cn("w-full", "flex", "flex-row", "justify-center", "items-center", "gap-x-2")}>
			<Button disabled={isDeletingChat} asChild variant={"ghost"} className={cn("w-full", "justify-start")}>
				<Link href={`/chat/${chatInfo.chatUuid}`}>{chatInfo.title}</Link>
			</Button>
			<Button disabled={isDeletingChat} onClick={() => deleteChat(chatInfo.chatUuid)} variant={"outline"} size={"sm"}>
				<Trash className={cn("size-4")} />
			</Button>
		</div>
	)
}

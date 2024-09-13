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
			<Button disabled={isDeletingChat} asChild variant={"ghost"} className={cn("justify-start", "w-full", "truncate")}>
				<Link href={`/chat/${chatInfo.chatUuid}`}>
					<span className={cn("truncate", "shrink")}>{chatInfo.title}</span>
				</Link>
			</Button>
			<Button disabled={isDeletingChat} onClick={() => deleteChat(chatInfo.chatUuid)} variant={"ghost"} size={"sm"}>
				<Trash className={cn("size-4")} />
			</Button>
		</div>
	)
}

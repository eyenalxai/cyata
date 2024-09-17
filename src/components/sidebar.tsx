"use client"

import { ChatList } from "@/components/chat-list/chat-list"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { ChatsResponse } from "@/lib/zod/api"
import { PanelLeft, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import type { z } from "zod"

type SidebarProps = {
	initialChats: z.infer<typeof ChatsResponse> | undefined
	className?: string
}

export const Sidebar = ({ initialChats }: SidebarProps) => {
	const [open, setOpen] = useState(false)

	return (
		<Sheet open={open} onOpenChange={(state) => setOpen(state)}>
			<SheetTrigger asChild>
				<Button variant={"ghost"}>
					<PanelLeft />
				</Button>
			</SheetTrigger>
			<SheetContent side={"left"} className={cn("w-full", "sm:w-96", "p-4", "overflow-y-auto")}>
				<div className={cn("w-full", "flex", "flex-col", "justify-start", "items-start", "gap-y-2")}>
					<div className={cn("w-full", "px-2", "flex", "flex-row", "justify-center", "items-center", "gap-x-2")}>
						<Button autoFocus asChild className={cn("w-full")} onClick={() => setOpen(false)}>
							<Link href={`/chat/${crypto.randomUUID()}`}>New Chat</Link>
						</Button>
						<Button variant={"ghost"} size={"icon"} className={cn("w-12")} onClick={() => setOpen(false)}>
							<X className={cn("size-5")} />
						</Button>
					</div>
					<ChatList initialChats={initialChats} className={cn("my-4")} />
				</div>
			</SheetContent>
		</Sheet>
	)
}

"use client"

import { ChatList } from "@/components/chat-list/chat-list"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { PanelLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export const Sidebar = () => {
	const [open, setOpen] = useState(false)

	return (
		<Drawer open={open} onOpenChange={(state) => setOpen(state)} direction={"left"}>
			<DrawerTrigger asChild>
				<Button variant={"ghost"}>
					<PanelLeft />
				</Button>
			</DrawerTrigger>
			<DrawerContent className={cn("w-full", "sm:w-96", "h-screen", "p-4")}>
				<div className={cn("w-full", "flex", "flex-col", "justify-center", "items-start", "gap-y-2")}>
					<div className={cn("w-full", "px-2")}>
						<Button asChild className={cn("w-full")} onClick={() => setOpen(false)}>
							<Link href={`/chat/${crypto.randomUUID()}`}>New Chat</Link>
						</Button>
					</div>
					<ChatList className={cn("mt-4")} />
				</div>
			</DrawerContent>
		</Drawer>
	)
}

"use client"

import { ChatList } from "@/components/chat-list/chat-list"
import { Button } from "@/components/ui/button"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	useSidebar
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import Link from "next/link"

export const AppSidebar = () => {
	const { setOpen } = useSidebar()

	return (
		<Sidebar>
			<SidebarHeader className={cn("bg-background")}>
				<SidebarMenu>
					<SidebarMenuItem>
						<Button autoFocus asChild className={cn("w-full")} onClick={() => setOpen(false)}>
							<Link href={`/chat/${crypto.randomUUID()}`}>New Chat</Link>
						</Button>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className={cn("bg-background", "pb-12")}>
				<SidebarGroup>
					<SidebarGroupContent>
						<ChatList />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}

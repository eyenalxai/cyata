import { ChatList } from "@/components/chat-list"
import { Button } from "@/components/ui/button"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { PanelLeft } from "lucide-react"

export const Sidebar = () => {
	return (
		<Drawer direction={"left"}>
			<DrawerTrigger asChild>
				<PanelLeft className={cn("cursor-pointer")} />
			</DrawerTrigger>
			<DrawerContent className={cn("w-full", "sm:w-96", "h-screen")}>
				<DrawerHeader>
					<DrawerTitle>Are you absolutely sure?</DrawerTitle>
					<DrawerDescription>This action cannot be undone.</DrawerDescription>
				</DrawerHeader>
				<ChatList />
				<DrawerFooter>
					<Button autoFocus>Submit</Button>
					<DrawerClose>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}

"use client"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/fetch/auth"
import { cn } from "@/lib/utils"
import { CircleUserRound, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type UserDropdownProps = {
	username: string
}

export const UserDropdown = ({ username }: UserDropdownProps) => {
	const router = useRouter()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"ghost"}>
					<CircleUserRound />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>{username}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem className={cn("cursor-pointer")} asChild>
					<Link href={"/settings"}>
						<Settings className={cn("mr-2", "size-4")} />
						<span>Settings</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className={cn("cursor-pointer")}
					onClick={async () => {
						await signOut().match(
							() => router.push("/auth"),
							() => toast.error("Failed to sign out")
						)
					}}
				>
					<LogOut className={cn("mr-2", "size-4")} />
					<span>Sign out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

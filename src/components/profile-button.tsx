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
import { CircleUserRound, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type ProfileButtonProps = {
	username: string
}

export const ProfileButton = ({ username }: ProfileButtonProps) => {
	const router = useRouter()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"ghost"} className={cn("w-fit")}>
					<CircleUserRound />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>{username}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild className={cn("cursor-pointer")}>
					<Link href={"/profile"}>Profile</Link>
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
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

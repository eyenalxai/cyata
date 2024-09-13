"use client"

import { DropdownUsage } from "@/components/dropdown-usage"
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
import type { Usage } from "@/lib/zod/api"
import { CircleUserRound, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { z } from "zod"

type DropdownUserProps = {
	username: string
	usages: z.infer<typeof Usage> | undefined
}

export const DropdownUser = ({ username, usages }: DropdownUserProps) => {
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
				<DropdownUsage usages={usages} />
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

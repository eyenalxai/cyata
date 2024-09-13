"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/fetch/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const SignOutButton = () => {
	const router = useRouter()

	return (
		<Button
			variant={"outline"}
			onClick={async () => {
				await signOut().match(
					() => router.push("/auth"),
					() => toast.error("Failed to sign out")
				)
			}}
		>
			Sign Out
		</Button>
	)
}

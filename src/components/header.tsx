import { Sidebar } from "@/components/sidebar"
import { SignOutButton } from "@/components/sign-out-button"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"
import { cn } from "@/lib/utils"
import { CircleUserRound } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export const Header = async () => {
	const session = await getSession()

	if (session.isErr()) {
		redirect("/auth")
	}

	return (
		<header
			className={cn(
				"py-2",
				"px-4",
				"sticky",
				"top-0",
				"z-50",
				"flex",
				"flex-row",
				"w-full",
				"shrink-0",
				"items-stretch",
				"justify-between",
				"backdrop-blur",
				"border-b",
				"gap-4"
			)}
		>
			<div className={cn("flex", "flex-row", "justify-center", "items-center", "gap-x-2")}>
				<Sidebar />
				<Button variant={"ghost"} asChild>
					<Link href={"/profile"}>
						<CircleUserRound />
					</Link>
				</Button>
			</div>
			<SignOutButton />
		</header>
	)
}

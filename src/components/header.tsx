import { Sidebar } from "@/components/sidebar"
import { UserDropdown } from "@/components/user-dropdown"
import { getSession } from "@/lib/session"
import { cn } from "@/lib/utils"
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
				"items-center",
				"justify-start",
				"backdrop-blur",
				"border-b",
				"gap-4"
			)}
		>
			<Sidebar />
			<UserDropdown username={session.value.username} />
		</header>
	)
}

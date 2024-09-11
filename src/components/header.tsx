import { Sidebar } from "@/components/sidebar"
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
				"p-2",
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
		</header>
	)
}

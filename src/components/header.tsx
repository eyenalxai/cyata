import { DropdownUser } from "@/components/dropdown-user"
import { Sidebar } from "@/components/sidebar"
import { getUsages } from "@/lib/database/usage"
import { getSession } from "@/lib/session"
import { cn } from "@/lib/utils"
import { redirect } from "next/navigation"

export const Header = async () => {
	const session = await getSession()

	if (session.isErr()) {
		redirect("/auth")
	}

	const usagesResult = await getUsages(session.value.uuid)

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
			<DropdownUser username={session.value.username} usages={usagesResult.isOk() ? usagesResult.value : undefined} />
		</header>
	)
}

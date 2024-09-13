import { Sidebar } from "@/components/sidebar"
import { UserDropdown } from "@/components/user-dropdown"
import { selectUsagesFromTo, selectUsagesTotal } from "@/lib/database/usage"
import { getSession } from "@/lib/session"
import { cn } from "@/lib/utils"
import { redirect } from "next/navigation"

export const Header = async () => {
	const session = await getSession()

	if (session.isErr()) {
		redirect("/auth")
	}

	const firstDayCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
	const lastDayCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)

	const firstDayPreviousMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
	const lastDayPreviousMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0)

	const usagesCurrentMonthResult = await selectUsagesFromTo({
		userUuid: session.value.uuid,
		from: firstDayCurrentMonth,
		to: lastDayCurrentMonth
	})
	const usagesPreviousMonthResult = await selectUsagesFromTo({
		userUuid: session.value.uuid,
		from: firstDayPreviousMonth,
		to: lastDayPreviousMonth
	})
	const usagesTotalResult = await selectUsagesTotal(session.value.uuid)

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
			<UserDropdown
				username={session.value.username}
				usageCurrentMonth={usagesCurrentMonthResult.isOk() ? usagesCurrentMonthResult.value : 0}
				usagePreviousMonth={usagesPreviousMonthResult.isOk() ? usagesPreviousMonthResult.value : 0}
				usageTotal={usagesTotalResult.isOk() ? usagesTotalResult.value : 0}
			/>
		</header>
	)
}

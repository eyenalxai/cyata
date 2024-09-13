import { UsageTable } from "@/components/usage-table"
import { UserSettings } from "@/components/user-settings"
import { selectUsagesForAllUsers } from "@/lib/database/usage"
import { selectUserPreferences } from "@/lib/database/user-preferences"
import { getSession } from "@/lib/session"
import { cn } from "@/lib/utils"
import { redirect } from "next/navigation"

export default async function Page() {
	const session = await getSession()

	if (session.isErr()) {
		redirect("/auth")
	}

	const userPreferences = await selectUserPreferences(session.value.uuid)

	const userUsagesResult = await selectUsagesForAllUsers()

	return (
		<div className={cn("max-w-screen-sm", "flex", "flex-col", "justify-center", "items-start", "gap-y-4")}>
			<UserSettings initialData={userPreferences.isOk() ? userPreferences.value : undefined} />
			{userUsagesResult.isOk() && <UsageTable userUsages={userUsagesResult.value} />}
		</div>
	)
}

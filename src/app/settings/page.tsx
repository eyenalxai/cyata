import { AllowedUsernamesServer } from "@/components/allowed-usernames/allowed-usernames-server"
import { CustomAlert } from "@/components/custom-alert"
import { UsageServer } from "@/components/usage/usage-server"
import { UserSettings } from "@/components/user-settings"
import { db } from "@/lib/database/client"
import { selectUserPreferences } from "@/lib/database/user-preferences"
import { getSession } from "@/lib/session"
import { cn } from "@/lib/utils"
import { redirect } from "next/navigation"

export default async function Page() {
	const session = await getSession()

	if (session.isErr()) {
		redirect("/auth")
	}

	const userPreferences = await selectUserPreferences(db, session.value.uuid)

	if (userPreferences.isErr()) return <CustomAlert>{userPreferences.error}</CustomAlert>

	return (
		<div className={cn("max-w-screen-sm", "flex", "flex-col", "justify-center", "items-start", "gap-y-4", "mb-12")}>
			<UserSettings initialUserPreferences={userPreferences.value} />
			{session.value.isAdmin && <UsageServer />}
			{session.value.isAdmin && <AllowedUsernamesServer />}
		</div>
	)
}

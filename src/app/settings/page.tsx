import { UserSettings } from "@/components/user-settings"
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

	return (
		<div className={cn("max-w-screen-sm")}>
			<UserSettings initialData={userPreferences.isOk() ? userPreferences.value : undefined} />
		</div>
	)
}

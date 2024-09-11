import { Profile } from "@/components/profile"
import { selectUserPreferences } from "@/lib/database/user-preferences"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function Page() {
	const session = await getSession()

	if (session.isErr()) {
		redirect("/auth")
	}

	const userPreferences = await selectUserPreferences(session.value.uuid)

	return <Profile initialData={userPreferences.isOk() ? userPreferences.value : undefined} />
}

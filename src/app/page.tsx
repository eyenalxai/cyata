import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function Page() {
	const session = await getSession()

	if (session.isErr()) {
		redirect("/auth")
	}

	redirect(`/chat/${crypto.randomUUID()}`)
}

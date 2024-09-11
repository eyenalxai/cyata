import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function Page() {
	const session = await getSession()

	if (session.isErr()) {
		console.error("Session error:", session.error)
		redirect("/auth")
	}

	redirect(`/chat/${crypto.randomUUID()}`)
}

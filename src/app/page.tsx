import { getSession } from "@/lib/session"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page() {
	const headersList = headers()
	const userAgent = headersList.get("user-agent")
	const isBot = userAgent?.toLowerCase().includes("bot") ?? false

	const session = await getSession()

	if (session.isErr() && !isBot) {
		console.error("Session error:", session.error)
		redirect("/auth")
	}

	if (!isBot) redirect(`/chat/${crypto.randomUUID()}`)

	return "Placeholder for SEO bots"
}

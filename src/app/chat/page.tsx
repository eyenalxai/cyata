import { redirect } from "next/navigation"

export default async function Page() {
	redirect(`/chat/${crypto.randomUUID()}`)
}
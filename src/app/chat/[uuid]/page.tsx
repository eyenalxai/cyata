import { Chat } from "@/components/chat"
import { selectChatWithMessages } from "@/lib/database/chat"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export type PageProps = {
	params: {
		uuid?: string
	}
}

export default async function Page({ params: { uuid } }: PageProps) {
	if (!uuid) {
		redirect(`/chat/${crypto.randomUUID()}`)
	}

	const session = await getSession()

	if (session.isErr()) {
		redirect("/auth")
	}

	const chat = await selectChatWithMessages(uuid)

	return <Chat uuid={uuid} initialMessages={chat.isOk() ? chat.value.messages : []} />
}

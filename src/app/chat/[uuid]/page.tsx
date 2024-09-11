import { Chat } from "@/components/chat"
import { CustomAlert } from "@/components/custom-alert"
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

	if (chat.isErr() && chat.error !== "CHAT_NOT_FOUND") return <CustomAlert>{chat.error}</CustomAlert>

	return (
		<Chat
			chatUuid={uuid}
			initialMessages={chat.isOk() ? chat.value.messages : []}
			initialModel={chat.isOk() ? chat.value.model : "gpt-4o-mini"}
		/>
	)
}

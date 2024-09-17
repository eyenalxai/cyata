import { Chat } from "@/components/chat"
import { CustomAlert } from "@/components/custom-alert"
import { selectChatWithMessages } from "@/lib/database/chat"
import { db } from "@/lib/database/client"
import { selectUserPreferences } from "@/lib/database/user-preferences"
import { getSession } from "@/lib/session"
import { defaultModel } from "@/lib/zod/model"
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

	const chat = await selectChatWithMessages(db, uuid)

	if (chat.isErr() && chat.error !== "CHAT_NOT_FOUND") return <CustomAlert>{chat.error}</CustomAlert>

	const userPreferences = await selectUserPreferences(db, session.value.uuid)

	return (
		<Chat
			chatUuid={uuid}
			initialMessages={chat.isOk() ? chat.value.messages : []}
			initialModel={
				chat.isOk() ? chat.value.model : userPreferences.isOk() ? userPreferences.value.defaultModel : defaultModel
			}
		/>
	)
}

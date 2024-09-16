import { DropdownUser } from "@/components/dropdown-user"
import { Sidebar } from "@/components/sidebar"
import { groupChatsByInterval } from "@/lib/chat/group"
import { selectChatsWithMessages } from "@/lib/database/chat"
import { selectUsages } from "@/lib/database/usage"
import { getSession } from "@/lib/session"
import { cn } from "@/lib/utils"
import { ChatsResponse } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import { redirect } from "next/navigation"

export const Header = async () => {
	const session = await getSession()

	if (session.isErr()) {
		redirect("/auth")
	}

	const usagesResult = await selectUsages(session.value.uuid)

	const chatsResult = await selectChatsWithMessages(session.value.uuid).andThen((chats) => {
		return parseZodSchema(ChatsResponse, groupChatsByInterval(chats))
	})

	return (
		<header
			className={cn(
				"py-2",
				"px-4",
				"sticky",
				"top-0",
				"z-50",
				"flex",
				"flex-row",
				"w-full",
				"shrink-0",
				"items-center",
				"justify-start",
				"backdrop-blur",
				"border-b",
				"gap-4"
			)}
		>
			<Sidebar initialChats={chatsResult.isOk() ? chatsResult.value : undefined} />
			<DropdownUser username={session.value.username} usages={usagesResult.isOk() ? usagesResult.value : undefined} />
		</header>
	)
}

import { selectChatsWithMessages } from "@/lib/database/chat"
import { getSession } from "@/lib/session"

import { groupChatsByInterval } from "@/lib/chat/group"
import { ChatsResponse } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import { NextResponse } from "next/server"

export async function GET() {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return selectChatsWithMessages(session.value.uuid)
		.andThen((chats) => {
			return parseZodSchema(ChatsResponse, groupChatsByInterval(chats))
		})
		.match(
			(chats) => NextResponse.json(chats),
			(e) => new NextResponse(e, { status: 400 })
		)
}

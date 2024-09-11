import { deleteChat } from "@/lib/database/chat"
import { getSession } from "@/lib/session"

import { NextResponse } from "next/server"

export type DeleteChatProps = {
	params: {
		uuid?: string
	}
}

export async function DELETE(_req: Request, { params: { uuid } }: DeleteChatProps) {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	if (!uuid) return new NextResponse("uuid is required", { status: 400 })

	return deleteChat(uuid).match(
		() => new NextResponse("Chat deleted", { status: 200 }),
		(e) => new NextResponse(e, { status: 400 })
	)
}

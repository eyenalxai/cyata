import { deleteChat } from "@/lib/database/chat"
import { getSession } from "@/lib/session"

import { db } from "@/lib/database/client"
import { NextResponse } from "next/server"

export type DeleteChatProps = {
	params: {
		uuid?: string
	}
}

export async function DELETE(_request: Request, { params: { uuid } }: DeleteChatProps) {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	if (!uuid) return new NextResponse("uuid is required", { status: 400 })

	return await db.transaction(async (tx) =>
		deleteChat(tx, uuid).match(
			() => new NextResponse("Chat deleted", { status: 200 }),
			(e) => new NextResponse(e, { status: 400 })
		)
	)
}

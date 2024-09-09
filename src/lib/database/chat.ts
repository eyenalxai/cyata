import { db } from "@/lib/database/client"
import { insertMessage } from "@/lib/database/message"
import { getErrorMessage } from "@/lib/error-message"
import { type ChatInsert, chats } from "@/lib/schema"
import type { AiMessageSchema } from "@/lib/zod/ai-message"
import { eq } from "drizzle-orm"
import { ResultAsync, errAsync, okAsync } from "neverthrow"
import type { z } from "zod"

export const insertChat = (chat: ChatInsert) => {
	return ResultAsync.fromPromise(db.insert(chats).values(chat).returning(), (e) =>
		getErrorMessage(e, "Failed to insert chat")
	).map(([insertedChat]) => insertedChat)
}

export const selectChat = (uuid: string) => {
	return ResultAsync.fromPromise(db.select().from(chats).where(eq(chats.uuid, uuid)), (e) =>
		getErrorMessage(e, "Failed to get session by key")
	).andThen((chats) => (chats.length > 0 ? okAsync(chats[0]) : errAsync("CHAT_NOT_FOUND" as const)))
}

type AddMessageToChat = {
	userUuid: string
	chatUuid: string
	message: z.infer<typeof AiMessageSchema>
}

export const addMessageToChat = ({ userUuid, chatUuid, message }: AddMessageToChat) => {
	return selectChat(chatUuid)
		.andThen((chat) =>
			insertMessage({
				...message,
				chatUuid: chat.uuid
			})
		)
		.orElse((e) => {
			if (e === "CHAT_NOT_FOUND")
				return insertChat({ uuid: chatUuid, userUuid }).andThen((chat) =>
					insertMessage({
						...message,
						chatUuid: chat.uuid
					})
				)

			return errAsync(e)
		})
}

import { db } from "@/lib/database/client"
import { insertMessage } from "@/lib/database/message"
import { getErrorMessage } from "@/lib/error-message"
import { type ChatInsert, chats } from "@/lib/schema"
import type { AiMessageSchema } from "@/lib/zod/ai-message"
import type { OpenAIModel } from "@/lib/zod/model"
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

type UpdateChatModelProps = {
	uuid: string
	model: z.infer<typeof OpenAIModel>
}

export const updateChatModel = ({ uuid, model }: UpdateChatModelProps) => {
	return ResultAsync.fromPromise(db.update(chats).set({ model }).where(eq(chats.uuid, uuid)).returning(), (e) =>
		getErrorMessage(e, "Failed to update chat model")
	).map(([updatedChat]) => updatedChat)
}

export const selectChatWithMessages = (chatUuid: string) => {
	return ResultAsync.fromPromise(
		db.query.chats.findFirst({
			where: eq(chats.uuid, chatUuid),
			with: {
				messages: {
					orderBy: (messages, { asc }) => [asc(messages.createdAt)]
				}
			}
		}),
		(e) => getErrorMessage(e, "Failed to get session by key")
	).andThen((chat) => (chat !== undefined ? okAsync(chat) : errAsync("CHAT_NOT_FOUND" as const)))
}

export const selectChatsWithMessages = (userUuid: string) => {
	return ResultAsync.fromPromise(
		db.query.chats.findMany({
			where: eq(chats.userUuid, userUuid),
			orderBy: (chats, { desc }) => [desc(chats.createdAt)],
			with: {
				messages: {
					orderBy: (messages, { asc }) => [asc(messages.createdAt)]
				}
			}
		}),
		(e) => getErrorMessage(e, "Failed to get session by key")
	)
}

type AddMessageToChat = {
	userUuid: string
	chatUuid: string
	message: z.infer<typeof AiMessageSchema>
	model: z.infer<typeof OpenAIModel>
}

export const addMessageToChat = ({ userUuid, chatUuid, message, model }: AddMessageToChat) => {
	return selectChat(chatUuid)
		.andThen((chat) => updateChatModel({ uuid: chat.uuid, model }))
		.andThen((chat) =>
			insertMessage({
				...message,
				chatUuid: chat.uuid
			})
		)
		.orElse((e) => {
			if (e === "CHAT_NOT_FOUND")
				return insertChat({ uuid: chatUuid, userUuid, model }).andThen((chat) =>
					insertMessage({
						...message,
						chatUuid: chat.uuid
					})
				)

			return errAsync(e)
		})
}

import { updateEmptyChatTitle } from "@/lib/chat/title"
import type { db } from "@/lib/database/client"
import { insertMessage } from "@/lib/database/message"
import { getErrorMessage } from "@/lib/error-message"
import { type ChatInsert, chats } from "@/lib/schema"
import type { AiMessageSchema } from "@/lib/zod/ai-message"
import type { OpenAIModel } from "@/lib/zod/model"
import { eq } from "drizzle-orm"
import { ResultAsync, errAsync, okAsync } from "neverthrow"
import type { z } from "zod"

export const insertChat = (tx: typeof db, chat: ChatInsert) =>
	ResultAsync.fromPromise(tx.insert(chats).values(chat).returning(), (e) =>
		getErrorMessage(e, "Failed to insert chat")
	).map(([insertedChat]) => insertedChat)

export const deleteChat = (tx: typeof db, uuid: string) =>
	ResultAsync.fromPromise(tx.delete(chats).where(eq(chats.uuid, uuid)), (e) =>
		getErrorMessage(e, "Failed to delete chat")
	).map(() => undefined)

export const selectChat = (tx: typeof db, uuid: string) =>
	ResultAsync.fromPromise(tx.select().from(chats).where(eq(chats.uuid, uuid)), (e) =>
		getErrorMessage(e, "Failed to select chat")
	).andThen((chats) => (chats.length > 0 ? okAsync(chats[0]) : errAsync("CHAT_NOT_FOUND" as const)))

type UpdateChatModelProps = {
	uuid: string
	model: z.infer<typeof OpenAIModel>
}

export const updateChatModel = (tx: typeof db, { uuid, model }: UpdateChatModelProps) =>
	ResultAsync.fromPromise(tx.update(chats).set({ model }).where(eq(chats.uuid, uuid)).returning(), (e) =>
		getErrorMessage(e, "Failed to update chat model")
	).map(([updatedChat]) => updatedChat)

export const selectChatWithMessages = (tx: typeof db, chatUuid: string) =>
	ResultAsync.fromPromise(
		tx.query.chats.findFirst({
			where: eq(chats.uuid, chatUuid),
			with: {
				messages: {
					orderBy: (messages, { asc }) => [asc(messages.createdAt)]
				}
			}
		}),
		(e) => getErrorMessage(e, "Failed to select chat with messages")
	).andThen((chat) => (chat !== undefined ? okAsync(chat) : errAsync("CHAT_NOT_FOUND" as const)))

export const selectChatsWithMessages = (tx: typeof db, userUuid: string) =>
	ResultAsync.fromPromise(
		tx.query.chats.findMany({
			where: eq(chats.userUuid, userUuid),
			orderBy: (chats, { desc }) => [desc(chats.createdAt)],
			with: {
				messages: {
					orderBy: (messages, { asc }) => [asc(messages.createdAt)]
				}
			}
		}),
		(e) => getErrorMessage(e, "Failed to select chats with messages")
	)

type AddMessageToChat = {
	userUuid: string
	chatUuid: string
	message: z.infer<typeof AiMessageSchema>
	model: z.infer<typeof OpenAIModel>
}

export const addMessageToChat = (tx: typeof db, { userUuid, chatUuid, message, model }: AddMessageToChat) =>
	selectChat(tx, chatUuid)
		.andThen((chat) => updateChatModel(tx, { uuid: chat.uuid, model }))
		.andThen((chat) =>
			insertMessage(tx, {
				...message,
				chatUuid: chat.uuid
			})
		)
		.orElse((e) => {
			if (e === "CHAT_NOT_FOUND")
				return insertChat(tx, { uuid: chatUuid, userUuid, model }).andThen((chat) =>
					insertMessage(tx, {
						...message,
						chatUuid: chat.uuid
					})
				)

			return errAsync(e)
		})
		.andThen(() => updateEmptyChatTitle(tx, chatUuid))

export const updateChatTitle = (tx: typeof db, chatUuid: string, title: string) =>
	ResultAsync.fromPromise(tx.update(chats).set({ title }).where(eq(chats.uuid, chatUuid)).returning(), (e) =>
		getErrorMessage(e, "Failed to update chat title")
	)

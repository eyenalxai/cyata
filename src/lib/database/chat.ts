import {updateEmptyChatTitle} from "@/lib/chat-title"
import {db} from "@/lib/database/client"
import {insertMessage} from "@/lib/database/message"
import {getErrorMessage} from "@/lib/error-message"
import {type ChatInsert, chats} from "@/lib/schema"
import type {AiMessageSchema} from "@/lib/zod/ai-message"
import type {OpenAIModel} from "@/lib/zod/model"
import {eq} from "drizzle-orm"
import {errAsync, okAsync, ResultAsync} from "neverthrow"
import type {z} from "zod"

export const insertChat = (chat: ChatInsert) =>
	ResultAsync.fromPromise(db.insert(chats).values(chat).returning(), (e) =>
		getErrorMessage(e, "Failed to insert chat")
	).map(([insertedChat]) => insertedChat)

export const deleteChat = (uuid: string) =>
	ResultAsync.fromPromise(db.delete(chats).where(eq(chats.uuid, uuid)), (e) =>
		getErrorMessage(e, "Failed to delete chat")
	).map(() => undefined)

export const selectChat = (uuid: string) =>
	ResultAsync.fromPromise(db.select().from(chats).where(eq(chats.uuid, uuid)), (e) =>
		getErrorMessage(e, "Failed to select chat")
	).andThen((chats) => (chats.length > 0 ? okAsync(chats[0]) : errAsync("CHAT_NOT_FOUND" as const)))

type UpdateChatModelProps = {
	uuid: string
	model: z.infer<typeof OpenAIModel>
}

export const updateChatModel = ({ uuid, model }: UpdateChatModelProps) =>
	ResultAsync.fromPromise(db.update(chats).set({ model }).where(eq(chats.uuid, uuid)).returning(), (e) =>
		getErrorMessage(e, "Failed to update chat model")
	).map(([updatedChat]) => updatedChat)

export const selectChatWithMessages = (chatUuid: string) =>
	ResultAsync.fromPromise(
		db.query.chats.findFirst({
			where: eq(chats.uuid, chatUuid),
			with: {
				messages: {
					orderBy: (messages, { asc }) => [asc(messages.createdAt)]
				}
			}
		}),
		(e) => getErrorMessage(e, "Failed to select chat with messages")
	).andThen((chat) => (chat !== undefined ? okAsync(chat) : errAsync("CHAT_NOT_FOUND" as const)))

export const selectChatsWithMessages = (userUuid: string) =>
	ResultAsync.fromPromise(
		db.query.chats.findMany({
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

export const addMessageToChat = ({ userUuid, chatUuid, message, model }: AddMessageToChat) =>
	selectChat(chatUuid)
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
		.andTee(() => updateEmptyChatTitle(chatUuid))

export const updateChatTitle = (chatUuid: string, title: string) =>
	ResultAsync.fromPromise(db.update(chats).set({ title }).where(eq(chats.uuid, chatUuid)).returning(), (e) =>
		getErrorMessage(e, "Failed to update chat title")
	)

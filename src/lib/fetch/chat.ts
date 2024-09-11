import { getErrorMessage } from "@/lib/error-message"
import { api } from "@/lib/fetch/fetcher"
import type { ChatsResponse, CompletionRequest } from "@/lib/zod/api"
import { ResultAsync } from "neverthrow"
import type { z } from "zod"

export const savePartial = (data: z.infer<typeof CompletionRequest>) =>
	ResultAsync.fromPromise(
		api("/api/chat/save-partial", {
			method: "post",
			json: data
		}),
		(e) => getErrorMessage(e, "Failed to save partial completion")
	)

export const fetchChats = () =>
	api<z.infer<typeof ChatsResponse>>("/api/chats", {
		method: "get",
		shouldParseJson: true
	})

export const deleteChat = (chatUuid: string) =>
	api(`/api/chat/${chatUuid}`, {
		method: "delete"
	})

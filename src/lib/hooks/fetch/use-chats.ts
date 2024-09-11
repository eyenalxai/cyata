"use client"

import { deleteChat, fetchChats } from "@/lib/fetch/chat"
import { CHATS_QUERY_KEY } from "@/lib/hooks/fetch/query-keys"
import { revalidatePage } from "@/lib/revalidate"
import type { ChatsResponse } from "@/lib/zod/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { err, ok } from "neverthrow"
import { revalidatePath } from "next/cache"
import { toast } from "sonner"
import type { z } from "zod"

export const useChats = () => {
	const chatsQueryKey = [CHATS_QUERY_KEY]
	const queryClient = useQueryClient()
	const { data: chats, error } = useQuery({ queryKey: chatsQueryKey, queryFn: fetchChats })

	const cancelQueries = async () => {
		await queryClient.cancelQueries({ queryKey: chatsQueryKey })
	}

	const invalidatesQueries = async () => {
		await queryClient.invalidateQueries({ queryKey: chatsQueryKey })
	}

	const { mutate: deleteChatMutation, isPending: isDeletingChat } = useMutation({
		mutationFn: async (chatUuid: string) => deleteChat(chatUuid),
		onMutate: async (chatUuid: string) => {
			await cancelQueries()

			const oldChats: z.infer<typeof ChatsResponse> | undefined = queryClient.getQueryData(chatsQueryKey)

			queryClient.setQueryData(chatsQueryKey, (oldChats: z.infer<typeof ChatsResponse> | undefined) => {
				if (oldChats === undefined) return oldChats
				return oldChats.filter((chat) => chat.chatUuid !== chatUuid)
			})

			return { oldChats, chatUuid }
		},
		onError: (_error, _variables, _context) => {
			console.log("error", _error)
			console.log("variables", _variables)
			console.log("context", _context)
			toast.error("Failed to delete chat")
		},
		onSuccess: async (_data, _variables, context) => {
			await revalidatePage("/chat/[uuid]")
		},
		onSettled: async (_error, _variables, _context) => {
			await invalidatesQueries()
		}
	})

	if (error)
		return {
			chatsResult: err(error.message),
			isLoading: false,
			deleteChat: deleteChatMutation,
			isDeletingChat
		} as const

	if (!chats) return { chatsResult: null, isLoading: true, deleteChat: deleteChatMutation, isDeletingChat } as const
	return { chatsResult: ok(chats), isLoading: false, deleteChat: deleteChatMutation, isDeletingChat } as const
}

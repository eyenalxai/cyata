"use client"

import { fetchChats } from "@/lib/fetch/chat"
import { CHATS_QUERY_KEY } from "@/lib/hooks/fetch/query-keys"
import { useQuery } from "@tanstack/react-query"
import { err, ok } from "neverthrow"

export const useChats = () => {
	const { data: chats, error } = useQuery({ queryKey: [CHATS_QUERY_KEY], queryFn: fetchChats })

	if (error) return { chatsResult: err(error.message), isLoading: false } as const

	if (!chats) return { chatsResult: null, isLoading: true } as const
	return { chatsResult: ok(chats), isLoading: false } as const
}

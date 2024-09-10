"use client"

import { fetchChats } from "@/lib/fetch/chat"
import { useQuery } from "@tanstack/react-query"

export const ChatList = () => {
	const { data, isLoading, error } = useQuery({ queryKey: ["chats"], queryFn: fetchChats })

	if (!data || isLoading) {
		return <div>Loading...</div>
	}

	return <div>{JSON.stringify(data)}</div>
}

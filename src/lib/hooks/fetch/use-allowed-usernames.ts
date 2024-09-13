"use client"

import {fetchAllowedUsernames} from "@/lib/fetch/allowed-username"
import {ALLOWED_USERNAMES_QUERY_KEY} from "@/lib/hooks/fetch/query-keys"
import type {AllowedUsernames} from "@/lib/zod/api"
import {useQuery, useQueryClient} from "@tanstack/react-query"
import {err, ok} from "neverthrow"
import type {z} from "zod"

type UseAllUsageProps = {
	initialAllowedUsernames: z.infer<typeof AllowedUsernames>
}

export const useAllowedUsernames = ({ initialAllowedUsernames }: UseAllUsageProps) => {
	const allowedUsernamesQueryKey = [ALLOWED_USERNAMES_QUERY_KEY]

	const queryClient = useQueryClient()

	const { data: allowedUsernames, error } = useQuery({
		queryKey: allowedUsernamesQueryKey,
		queryFn: fetchAllowedUsernames,
		initialData: initialAllowedUsernames
	})

	if (error)
		return {
			allowedUsernamesResult: err(error.message),
			isLoading: false
		} as const

	if (!allowedUsernames)
		return {
			allowedUsernamesResult: null,
			isLoading: true
		} as const
	return {
		allowedUsernamesResult: ok(allowedUsernames),
		isLoading: false
	} as const
}

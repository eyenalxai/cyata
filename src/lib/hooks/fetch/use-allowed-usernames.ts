"use client"

import { fetchAllowedUsernames, saveAllowedUsername } from "@/lib/fetch/allowed-username"
import { ALLOWED_USERNAMES_QUERY_KEY } from "@/lib/hooks/fetch/query-keys"
import type { AllowedUsername, AllowedUsernames } from "@/lib/zod/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { err, ok } from "neverthrow"
import { toast } from "sonner"
import type { z } from "zod"

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

	const cancelQueries = async () => {
		await queryClient.cancelQueries({ queryKey: allowedUsernamesQueryKey })
	}

	const invalidatesQueries = async () => {
		await queryClient.invalidateQueries({ queryKey: allowedUsernamesQueryKey })
	}

	const { mutate: addAllowedUsernameMutation, isPending: isAddingAllowedUsername } = useMutation({
		mutationFn: async (allowedUsername: z.infer<typeof AllowedUsername>) => saveAllowedUsername(allowedUsername),
		onMutate: async (allowedUsername: z.infer<typeof AllowedUsername>) => {
			await cancelQueries()

			const oldAllowedUsernames: z.infer<typeof AllowedUsernames> | undefined =
				queryClient.getQueryData(allowedUsernamesQueryKey)

			queryClient.setQueryData(
				allowedUsernamesQueryKey,
				(oldAllowedUsernames: z.infer<typeof AllowedUsernames> | undefined) => {
					if (oldAllowedUsernames === undefined) return oldAllowedUsernames
					return [...oldAllowedUsernames, allowedUsername].sort((a, b) =>
						a.username.localeCompare(b.username)
					) satisfies z.infer<typeof AllowedUsernames>
				}
			)

			return oldAllowedUsernames
		},
		onError: (_error, _variables, _context) => {
			toast.error("Failed to add allowed username")
		},
		onSettled: async (_error, _variables, _context) => {
			await invalidatesQueries()
		}
	})

	if (error)
		return {
			allowedUsernamesResult: err(error.message),
			isLoading: false,
			addAllowedUsername: addAllowedUsernameMutation,
			isAddingAllowedUsername
		} as const

	if (!allowedUsernames)
		return {
			allowedUsernamesResult: null,
			isLoading: true,
			addAllowedUsername: addAllowedUsernameMutation,
			isAddingAllowedUsername
		} as const
	return {
		allowedUsernamesResult: ok(allowedUsernames),
		isLoading: false,
		addAllowedUsername: addAllowedUsernameMutation,
		isAddingAllowedUsername
	} as const
}

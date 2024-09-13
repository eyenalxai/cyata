"use client"

import { fetchAllUsage } from "@/lib/fetch/usage"
import { toggleUserIsRestricted } from "@/lib/fetch/user"
import { All_USAGE_QUERY_KEY } from "@/lib/hooks/fetch/query-keys"
import type { AllUsersUsage, RestrictRequest, UsersUsage } from "@/lib/zod/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { err, ok } from "neverthrow"
import { toast } from "sonner"
import type { z } from "zod"

type UseAllUsageProps = {
	initialAllUsage: z.infer<typeof AllUsersUsage>
}

export const useAllUsage = ({ initialAllUsage }: UseAllUsageProps) => {
	const allUsageQueryKey = [All_USAGE_QUERY_KEY]

	const queryClient = useQueryClient()

	const { data: allUsage, error } = useQuery({
		queryKey: allUsageQueryKey,
		queryFn: fetchAllUsage,
		initialData: initialAllUsage
	})

	const cancelQueries = async () => {
		await queryClient.cancelQueries({ queryKey: allUsageQueryKey })
	}

	const invalidatesQueries = async () => {
		await queryClient.invalidateQueries({ queryKey: allUsageQueryKey })
	}

	const { mutate: toggleIsRestrictedMutation, isPending: isTogglingIsRestricted } = useMutation({
		mutationFn: async (restrictRequest: z.infer<typeof RestrictRequest>) => toggleUserIsRestricted(restrictRequest),
		onMutate: async (restrictRequest: z.infer<typeof RestrictRequest>) => {
			await cancelQueries()

			const oldAllUsage: z.infer<typeof AllUsersUsage> | undefined = queryClient.getQueryData(allUsageQueryKey)

			queryClient.setQueryData(allUsageQueryKey, (oldAllUsage: z.infer<typeof AllUsersUsage> | undefined) => {
				if (oldAllUsage === undefined) return oldAllUsage
				return oldAllUsage.map((usage) => {
					if (usage.user.uuid === restrictRequest.userUuid) {
						return {
							...usage,
							user: {
								...usage.user,
								isRestricted: restrictRequest.isRestricted
							}
						} satisfies z.infer<typeof UsersUsage>
					}
					return usage
				}) satisfies z.infer<typeof AllUsersUsage>
			})

			return oldAllUsage
		},
		onError: (_error, _variables, _context) => {
			toast.error("Failed to toggle user restriction")
		},
		onSettled: async (_error, _variables, _context) => {
			await invalidatesQueries()
		}
	})

	if (error)
		return {
			allUsageResult: err(error.message),
			isLoading: false,
			toggleIsRestricted: toggleIsRestrictedMutation,
			isTogglingIsRestricted
		} as const

	if (!allUsage)
		return {
			allUsageResult: null,
			isLoading: true,
			toggleIsRestricted: toggleIsRestrictedMutation,
			isTogglingIsRestricted
		} as const
	return {
		allUsageResult: ok(allUsage),
		isLoading: false,
		toggleIsRestricted: toggleIsRestrictedMutation,
		isTogglingIsRestricted
	} as const
}

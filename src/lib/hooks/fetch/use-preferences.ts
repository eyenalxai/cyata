"use client"

import { fetchPreferences, updateDefaultModel } from "@/lib/fetch/preferences"
import { PREFERENCES_QUERY_KEY } from "@/lib/hooks/fetch/query-keys"
import type { PreferencesResponse } from "@/lib/zod/api"
import type { OpenAIModel } from "@/lib/zod/model"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { err, ok } from "neverthrow"
import { toast } from "sonner"
import type { z } from "zod"

type UsePreferencesProps = {
	initialData: z.infer<typeof PreferencesResponse> | undefined
}

export const usePreferences = ({ initialData }: UsePreferencesProps) => {
	const preferencesQueryKey = [PREFERENCES_QUERY_KEY]
	const queryClient = useQueryClient()
	const { data: preferences, error } = useQuery({
		queryKey: preferencesQueryKey,
		queryFn: fetchPreferences,
		initialData: initialData
	})

	const cancelQueries = async () => {
		await queryClient.cancelQueries({ queryKey: preferencesQueryKey })
	}

	const invalidatesQueries = async () => {
		await queryClient.invalidateQueries({ queryKey: preferencesQueryKey })
	}

	const { mutate: updateDefaultModelMutation, isPending: updatingDefaultModel } = useMutation({
		mutationFn: async (defaultModel: z.infer<typeof OpenAIModel>) => updateDefaultModel(defaultModel),
		onMutate: async (defaultModel: z.infer<typeof OpenAIModel>) => {
			await cancelQueries()
			const oldPreferences: z.infer<typeof PreferencesResponse> | undefined =
				queryClient.getQueryData(preferencesQueryKey)

			queryClient.setQueryData(preferencesQueryKey, () => {
				if (oldPreferences === undefined) return oldPreferences
				return {
					...oldPreferences,
					defaultModel
				} satisfies z.infer<typeof PreferencesResponse>
			})
		},
		onError: (_error, _variables, _context) => {
			toast.error("Failed to update default model")
		},
		onSettled: async (_error, _variables, _context) => {
			await invalidatesQueries()
		}
	})

	if (error)
		return {
			preferencesResult: err(error.message),
			isLoading: false,
			updateDefaultModel: updateDefaultModelMutation,
			updatingDefaultModel
		} as const

	if (!preferences)
		return {
			preferencesResult: null,
			isLoading: true,
			updateDefaultModel: updateDefaultModelMutation,
			updatingDefaultModel
		} as const

	return {
		preferencesResult: ok(preferences),
		isLoading: false,
		updateDefaultModel: updateDefaultModelMutation,
		updatingDefaultModel
	} as const
}

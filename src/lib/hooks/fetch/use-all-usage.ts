"use client"

import { fetchAllUsage } from "@/lib/fetch/usage"
import { All_USAGE_QUERY_KEY } from "@/lib/hooks/fetch/query-keys"
import type { AllUsersUsage } from "@/lib/zod/api"
import { useQuery } from "@tanstack/react-query"
import { err, ok } from "neverthrow"
import type { z } from "zod"

type UseAllUsageProps = {
	initialAllUsage: z.infer<typeof AllUsersUsage>
}

export const useAllUsage = ({ initialAllUsage }: UseAllUsageProps) => {
	const { data: allUsage, error } = useQuery({
		queryKey: [All_USAGE_QUERY_KEY],
		queryFn: fetchAllUsage,
		initialData: initialAllUsage
	})

	if (error)
		return {
			allUsageResult: err(error.message),
			isLoading: false
		} as const

	if (!allUsage) return { allUsageResult: null, isLoading: true } as const
	return { allUsageResult: ok(allUsage), isLoading: false } as const
}

"use client"

import { fetchAllUsage } from "@/lib/fetch/usage"
import { All_USAGE_QUERY_KEY } from "@/lib/hooks/fetch/query-keys"
import { useQuery } from "@tanstack/react-query"
import { err, ok } from "neverthrow"

export const useAllUsage = () => {
	const { data: allUsage, error } = useQuery({
		queryKey: [All_USAGE_QUERY_KEY],
		queryFn: fetchAllUsage
	})

	if (error)
		return {
			allUsageResult: err(error.message),
			isLoading: false
		} as const

	if (!allUsage) return { allUsageResult: null, isLoading: true } as const
	return { allUsageResult: ok(allUsage), isLoading: false } as const
}

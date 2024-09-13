"use client"

import { fetchUsage } from "@/lib/fetch/usage"
import { USAGE_QUERY_KEY } from "@/lib/hooks/fetch/query-keys"
import type { Usage } from "@/lib/zod/api"
import { useQuery } from "@tanstack/react-query"
import { err, ok } from "neverthrow"
import type { z } from "zod"

type UseUsageProps = {
	initialData?: z.infer<typeof Usage> | undefined
}

export const useUsage = ({ initialData }: UseUsageProps) => {
	const { data: usage, error } = useQuery({
		queryKey: [USAGE_QUERY_KEY],
		queryFn: fetchUsage,
		initialData: initialData
	})

	if (error)
		return {
			usageResult: err(error.message),
			isLoading: false
		} as const

	if (!usage) return { usageResult: null, isLoading: true } as const
	return { usageResult: ok(usage), isLoading: false } as const
}

import { api } from "@/lib/fetch/fetcher"
import type { AllUsersUsage, Usage } from "@/lib/zod/api"
import type { z } from "zod"

export const fetchUsage = () =>
	api<z.infer<typeof Usage>>("/api/usage", {
		method: "get",
		shouldParseJson: true
	})

export const fetchAllUsage = () =>
	api<z.infer<typeof AllUsersUsage>>("/api/usage/all", {
		method: "get",
		shouldParseJson: true
	})

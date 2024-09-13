import { api } from "@/lib/fetch/fetcher"
import type { Usage } from "@/lib/zod/api"
import type { z } from "zod"

export const fetchUsage = () =>
	api<z.infer<typeof Usage>>("/api/usage", {
		method: "get",
		shouldParseJson: true
	})

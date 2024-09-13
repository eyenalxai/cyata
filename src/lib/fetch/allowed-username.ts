import { api } from "@/lib/fetch/fetcher"
import type { AllowedUsernames } from "@/lib/zod/api"
import type { z } from "zod"

export const fetchAllowedUsernames = () =>
	api<z.infer<typeof AllowedUsernames>>("/api/allowed-usernames", {
		method: "get",
		shouldParseJson: true
	})

import { api } from "@/lib/fetch/fetcher"
import type { AllowedUsername, AllowedUsernames } from "@/lib/zod/api"
import type { z } from "zod"

export const fetchAllowedUsernames = () =>
	api<z.infer<typeof AllowedUsernames>>("/api/allowed-usernames", {
		method: "get",
		shouldParseJson: true
	})

export const saveAllowedUsername = (allowedUsername: z.infer<typeof AllowedUsername>) =>
	api("/api/allowed-usernames", {
		method: "post",
		json: allowedUsername
	})

import { api } from "@/lib/fetch/fetcher"
import type { RestrictRequest } from "@/lib/zod/api"
import type { z } from "zod"

export const toggleUserIsRestricted = (restrictRequest: z.infer<typeof RestrictRequest>) =>
	api("/api/user/toggle-restrict", {
		method: "patch",
		json: restrictRequest
	})

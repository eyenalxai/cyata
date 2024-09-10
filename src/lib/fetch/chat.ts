import { getErrorMessage } from "@/lib/error-message"
import { api } from "@/lib/fetch/fetcher"
import type { CompletionRequest } from "@/lib/zod/api"
import { ResultAsync } from "neverthrow"
import type { z } from "zod"

export const savePartial = (data: z.infer<typeof CompletionRequest>) => {
	return ResultAsync.fromPromise(
		api("/api/chat/save-partial", {
			method: "post",
			json: data
		}),
		(e) => getErrorMessage(e, "Failed to save partial completion")
	)
}

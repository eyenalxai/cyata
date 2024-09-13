import { api } from "@/lib/fetch/fetcher"
import type { PreferencesResponse, SystemPrompt } from "@/lib/zod/api"
import type { OpenAIModel } from "@/lib/zod/model"
import type { z } from "zod"

export const fetchPreferences = () =>
	api<z.infer<typeof PreferencesResponse>>("/api/preferences", {
		method: "get",
		shouldParseJson: true
	})

export const updateDefaultModel = (defaultModel: z.infer<typeof OpenAIModel>) =>
	api("/api/preferences/default-model", {
		method: "patch",
		json: { defaultModel }
	})

export const updateSystemPrompt = (systemPrompt: z.infer<typeof SystemPrompt>) =>
	api("/api/preferences/system-prompt", {
		method: "patch",
		json: { systemPrompt }
	})

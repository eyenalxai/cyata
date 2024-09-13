import { db } from "@/lib/database/client"
import { getErrorMessage } from "@/lib/error-message"
import { type UserPreferencesInsert, userPreferences } from "@/lib/schema"
import type { SystemPrompt } from "@/lib/zod/api"
import type { OpenAIModel } from "@/lib/zod/model"
import { eq } from "drizzle-orm"
import { ResultAsync, errAsync, okAsync } from "neverthrow"
import type { z } from "zod"

export const selectUserPreferences = (userUuid: string) => {
	return ResultAsync.fromPromise(db.select().from(userPreferences).where(eq(userPreferences.userUuid, userUuid)), (e) =>
		getErrorMessage(e, "Failed to select user preferences")
	).andThen((preferences) => (preferences.length > 0 ? okAsync(preferences[0]) : errAsync("User not found")))
}

export const insertUserPreferences = (preferences: UserPreferencesInsert) => {
	return ResultAsync.fromPromise(db.insert(userPreferences).values(preferences).returning(), (e) =>
		getErrorMessage(e, "Failed to insert user preferences")
	).map(([insertedPreferences]) => insertedPreferences)
}

type UpdateDefaultModelProps = {
	userUuid: string
	defaultModel: z.infer<typeof OpenAIModel>
}

export const updateDefaultModel = ({ userUuid, defaultModel }: UpdateDefaultModelProps) => {
	return ResultAsync.fromPromise(
		db.update(userPreferences).set({ defaultModel }).where(eq(userPreferences.userUuid, userUuid)),
		(e) => getErrorMessage(e, "Failed to update user default model")
	).map(([preferences]) => preferences)
}

type UpdateSystemPromptProps = {
	userUuid: string
	systemPrompt: z.infer<typeof SystemPrompt>
}

export const updateSystemPrompt = ({ userUuid, systemPrompt }: UpdateSystemPromptProps) => {
	return ResultAsync.fromPromise(
		db.update(userPreferences).set({ systemPrompt }).where(eq(userPreferences.userUuid, userUuid)),
		(e) => getErrorMessage(e, "Failed to update user system prompt")
	).map(([preferences]) => preferences)
}

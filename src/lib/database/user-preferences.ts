import { db } from "@/lib/database/client"
import { getErrorMessage } from "@/lib/error-message"
import { userPreferences } from "@/lib/schema"
import type { OpenAIModel } from "@/lib/zod/model"
import { eq } from "drizzle-orm"
import { ResultAsync, errAsync, okAsync } from "neverthrow"
import type { z } from "zod"

type UpdateDefaultModelProps = {
	userUuid: string
	defaultModel: z.infer<typeof OpenAIModel>
}

export const selectUserPreferences = (userUuid: string) => {
	return ResultAsync.fromPromise(db.select().from(userPreferences).where(eq(userPreferences.userUuid, userUuid)), (e) =>
		getErrorMessage(e, "Failed to get user by username")
	).andThen((users) => (users.length > 0 ? okAsync(users[0]) : errAsync("User not found")))
}

export const insertUserPreferences = ({ userUuid, defaultModel }: UpdateDefaultModelProps) => {
	return ResultAsync.fromPromise(db.insert(userPreferences).values({ userUuid, defaultModel }).returning(), (e) =>
		getErrorMessage(e, "Failed to insert user preferences")
	).map(([insertedPreferences]) => insertedPreferences)
}

export const updateDefaultModel = ({ userUuid, defaultModel }: UpdateDefaultModelProps) => {
	return ResultAsync.fromPromise(
		db.update(userPreferences).set({ defaultModel }).where(eq(userPreferences.userUuid, userUuid)),
		(e) => getErrorMessage(e, "Failed to update user default model")
	)
}

export const setDefaultModel = ({ userUuid, defaultModel }: UpdateDefaultModelProps) => {
	return selectUserPreferences(userUuid)
		.andThen((preferences) => {
			if (preferences.defaultModel === defaultModel) return okAsync(preferences)

			return updateDefaultModel({ userUuid, defaultModel })
		})
		.orElse(() => insertUserPreferences({ userUuid, defaultModel }))
}

import { db } from "@/lib/database/client"
import { getErrorMessage } from "@/lib/error-message"
import { type UsageInsert, usages } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { ResultAsync } from "neverthrow"

export const selectUsages = (userUuid: string) => {
	return ResultAsync.fromPromise(db.select().from(usages).where(eq(usages.userUuid, userUuid)), (e) =>
		getErrorMessage(e, "Failed to get usages")
	)
}

export const insertUsage = (usage: UsageInsert) => {
	console.log("saving")

	return ResultAsync.fromPromise(db.insert(usages).values(usage).returning(), (e) =>
		getErrorMessage(e, "Failed to insert usage")
	).map(([insertedUsage]) => insertedUsage)
}

import { db } from "@/lib/database/client"
import { getErrorMessage } from "@/lib/error-message"
import { type UsageInsert, usages } from "@/lib/schema"
import { and, eq, gte, lte } from "drizzle-orm"
import { ResultAsync } from "neverthrow"

export const selectUsagesTotal = (userUuid: string) => {
	return ResultAsync.fromPromise(db.select().from(usages).where(eq(usages.userUuid, userUuid)), (e) =>
		getErrorMessage(e, "Failed to select usages")
	).map((usages) => Number.parseFloat(usages.reduce((acc, usage) => acc + usage.usage, 0).toFixed(2)))
}

type SelectUsagesFromToProps = {
	userUuid: string
	from: Date
	to: Date
}

export const selectUsagesFromTo = ({ userUuid, from, to }: SelectUsagesFromToProps) => {
	return ResultAsync.fromPromise(
		db
			.select()
			.from(usages)
			.where(
				and(
					eq(usages.userUuid, userUuid),
					and(gte(usages.createdAt, from.toISOString()), lte(usages.createdAt, to.toISOString()))
				)
			),
		(e) => getErrorMessage(e, "Failed to select usages")
	).map((usages) => Number.parseFloat(usages.reduce((acc, usage) => acc + usage.usage, 0).toFixed(2)))
}

export const insertUsage = (usage: UsageInsert) => {
	return ResultAsync.fromPromise(db.insert(usages).values(usage).returning(), (e) =>
		getErrorMessage(e, "Failed to insert usage")
	).map(([insertedUsage]) => insertedUsage)
}

export const getUsages = (userUuid: string) => {
	const firstDayCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
	const lastDayCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)

	const firstDayPreviousMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
	const lastDayPreviousMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0)

	return selectUsagesFromTo({
		userUuid: userUuid,
		from: firstDayCurrentMonth,
		to: lastDayCurrentMonth
	})
		.andThen((usageCurrentMonth) =>
			selectUsagesFromTo({
				userUuid: userUuid,
				from: firstDayPreviousMonth,
				to: lastDayPreviousMonth
			}).map((usagePreviousMonth) => ({ usageCurrentMonth, usagePreviousMonth }))
		)
		.andThen(({ usageCurrentMonth, usagePreviousMonth }) =>
			selectUsagesTotal(userUuid).map((usageTotal) => ({
				usageCurrentMonth,
				usagePreviousMonth,
				usageTotal
			}))
		)
}

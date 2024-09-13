import { db } from "@/lib/database/client"
import { selectAllUsers } from "@/lib/database/user"
import { getErrorMessage } from "@/lib/error-message"
import { type UsageInsert, usages } from "@/lib/schema"
import type { AsyncOk } from "@/lib/type-utils"
import { AllUsersUsage, type UsersUsage } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import { and, eq, gte, lte } from "drizzle-orm"
import { ResultAsync } from "neverthrow"
import type { z } from "zod"

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

export const selectUsages = (userUuid: string) => {
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

export const selectUsagesForAllUsers = () => {
	return selectAllUsers()
		.andThen((users) =>
			ResultAsync.combine(
				users.map((user) =>
					selectUsages(user.uuid).map((usages) => ({
						user,
						usages
					}))
				)
			)
		)
		.map((userUsages) => {
			return userUsages.map((userUsage) => {
				return {
					username: userUsage.user.username,
					usage: {
						usageCurrentMonth: userUsage.usages.usageCurrentMonth,
						usagePreviousMonth: userUsage.usages.usagePreviousMonth,
						usageTotal: userUsage.usages.usageTotal
					}
				} satisfies z.infer<typeof UsersUsage>
			})
		})
		.andThen((usages) => parseZodSchema(AllUsersUsage, usages))
}

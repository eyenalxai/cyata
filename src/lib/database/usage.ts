import { selectAllUsers } from "@/lib/database/user"
import { getErrorMessage } from "@/lib/error-message"
import { type UsageInsert, usages } from "@/lib/schema"
import type { Transaction } from "@/lib/type-utils"
import { AllUsersUsage, type UsersUsage } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import { and, eq, gte, lte } from "drizzle-orm"
import { ResultAsync } from "neverthrow"
import type { z } from "zod"

export const selectUsagesTotal = (tx: Transaction, userUuid: string) =>
	ResultAsync.fromPromise(tx.select().from(usages).where(eq(usages.userUuid, userUuid)), (e) =>
		getErrorMessage(e, "Failed to select usages")
	).map((usages) => Number.parseFloat(usages.reduce((acc, usage) => acc + usage.usage, 0).toFixed(2)))

type SelectUsagesFromToProps = {
	userUuid: string
	from: Date
	to: Date
}

export const selectUsagesFromTo = (tx: Transaction, { userUuid, from, to }: SelectUsagesFromToProps) =>
	ResultAsync.fromPromise(
		tx
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

export const insertUsage = (tx: Transaction, usage: UsageInsert) =>
	ResultAsync.fromPromise(tx.insert(usages).values(usage).returning(), (e) =>
		getErrorMessage(e, "Failed to insert usage")
	).map(([insertedUsage]) => insertedUsage)

export const selectUsages = (tx: Transaction, userUuid: string) => {
	const firstDayCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
	const lastDayCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)

	const firstDayPreviousMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
	const lastDayPreviousMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0)

	return selectUsagesFromTo(tx, {
		userUuid: userUuid,
		from: firstDayCurrentMonth,
		to: lastDayCurrentMonth
	})
		.andThen((usageCurrentMonth) =>
			selectUsagesFromTo(tx, {
				userUuid: userUuid,
				from: firstDayPreviousMonth,
				to: lastDayPreviousMonth
			}).map((usagePreviousMonth) => ({ usageCurrentMonth, usagePreviousMonth }))
		)
		.andThen(({ usageCurrentMonth, usagePreviousMonth }) =>
			selectUsagesTotal(tx, userUuid).map((usageTotal) => ({
				usageCurrentMonth,
				usagePreviousMonth,
				usageTotal
			}))
		)
}

export const selectUsagesForAllUsers = (tx: Transaction) =>
	selectAllUsers(tx)
		.andThen((users) =>
			ResultAsync.combine(
				users.map((user) =>
					selectUsages(tx, user.uuid).map((usages) => ({
						user,
						usages
					}))
				)
			)
		)
		.map((userUsages) => {
			return userUsages.map((userUsage) => {
				return {
					user: {
						uuid: userUsage.user.uuid,
						username: userUsage.user.username,
						isRestricted: userUsage.user.isRestricted
					},
					usage: {
						usageCurrentMonth: userUsage.usages.usageCurrentMonth,
						usagePreviousMonth: userUsage.usages.usagePreviousMonth,
						usageTotal: userUsage.usages.usageTotal
					}
				} satisfies z.infer<typeof UsersUsage>
			})
		})
		.andThen((usages) => parseZodSchema(AllUsersUsage, usages))

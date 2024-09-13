import { getSession } from "@/lib/session"

import { selectUsagesForAllUsers } from "@/lib/database/usage"
import { AllUsersUsage, type UsersUsage } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import { NextResponse } from "next/server"
import type { z } from "zod"

export async function GET() {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	if (!session.value.isAdmin) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return selectUsagesForAllUsers()
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
		.match(
			(usages) => NextResponse.json(usages),
			(e) => new NextResponse(e, { status: 400 })
		)
}

import { getSession } from "@/lib/session"

import { selectUsagesForAllUsers } from "@/lib/database/usage"

import { db } from "@/lib/database/client"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	if (!session.value.isAdmin) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return await db.transaction(async (tx) =>
		selectUsagesForAllUsers(tx).match(
			(usages) => NextResponse.json(usages),
			(e) => new NextResponse(e, { status: 400 })
		)
	)
}

import { getSession } from "@/lib/session"

import { selectUsagesForAllUsers } from "@/lib/database/usage"

import { NextResponse } from "next/server"

export async function GET() {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	if (!session.value.isAdmin) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return selectUsagesForAllUsers().match(
		(usages) => NextResponse.json(usages),
		(e) => new NextResponse(e, { status: 400 })
	)
}

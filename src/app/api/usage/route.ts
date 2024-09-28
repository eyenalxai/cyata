import { getSession } from "@/lib/session"

import { db } from "@/lib/database/client"
import { selectUsages } from "@/lib/database/usage"
import { Usage } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return await db.transaction(async (tx) =>
		selectUsages(tx, session.value.uuid)
			.andThen((usages) => parseZodSchema(Usage, usages))
			.match(
				(usages) => NextResponse.json(usages),
				(e) => new NextResponse(e, { status: 400 })
			)
	)
}

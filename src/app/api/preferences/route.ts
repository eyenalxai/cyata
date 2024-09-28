import { getSession } from "@/lib/session"

import { db } from "@/lib/database/client"
import { selectUserPreferences } from "@/lib/database/user-preferences"
import { PreferencesResponse } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return await db.transaction(async (tx) =>
		selectUserPreferences(tx, session.value.uuid)
			.andThen((preferences) => parseZodSchema(PreferencesResponse, preferences))
			.match(
				(preferences) => NextResponse.json(preferences),
				(e) => new NextResponse(e, { status: 400 })
			)
	)
}

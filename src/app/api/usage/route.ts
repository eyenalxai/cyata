import { getSession } from "@/lib/session"

import { selectUsages } from "@/lib/database/usage"
import { Usage } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import { NextResponse } from "next/server"

export async function GET() {
	const session = await getSession()

	if (session.isErr()) {
		return new NextResponse("Unauthorized", { status: 403 })
	}

	return selectUsages(session.value.uuid)
		.andThen((usages) => parseZodSchema(Usage, usages))
		.match(
			(usages) => NextResponse.json(usages),
			(e) => new NextResponse(e, { status: 400 })
		)
}

import { clearSessionKey } from "@/lib/cookie"

import { NextResponse } from "next/server"

export const DELETE = async (_request: Request) => {
	clearSessionKey()

	return new NextResponse("Signed out", { status: 200 })
}

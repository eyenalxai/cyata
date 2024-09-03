import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		COOKIES_EXPIRES_IN_DAYS: z.coerce.number().optional().default(30)
	},
	client: {},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		COOKIES_EXPIRES_IN_DAYS: process.env.COOKIES_EXPIRES_IN_DAYS
	},
	skipValidation: process.env.BUILD_TIME?.toLowerCase() === "true"
})

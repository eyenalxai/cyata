import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		SESSION_COOKIES_EXPIRES_IN_DAYS: z.coerce.number().optional().default(30),
		SESSION_COOKIE_NAME: z.string().min(2).optional().default("session")
	},
	client: {},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		SESSION_COOKIES_EXPIRES_IN_DAYS: process.env.SESSION_COOKIES_EXPIRES_IN_DAYS,
		SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME
	},
	skipValidation: process.env.BUILD_TIME?.toLowerCase() === "true"
})

import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
	server: {
		POSTGRES_USER: z.string().min(2),
		POSTGRES_PASSWORD: z.string().min(2),
		POSTGRES_DB: z.string().min(2),
		POSTGRES_ADDRESS: z.string().min(2),
		SESSION_COOKIES_EXPIRES_IN_DAYS: z.coerce.number().optional().default(30),
		SESSION_COOKIE_NAME: z.string().min(2).optional().default("session"),
		OPENAI_API_KEY: z.string().refine((value) => value.startsWith("sk-") && value.length >= 16, {
			message: "OPENAI_API_KEY must start with 'sk-' and be at least 16 characters long if set."
		}),
		TURNSTILE_SECRET_KEY: z.string()
	},
	client: {
		NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string()
	},
	runtimeEnv: {
		POSTGRES_USER: process.env.POSTGRES_USER,
		POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
		POSTGRES_ADDRESS: process.env.POSTGRES_ADDRESS,
		POSTGRES_DB: process.env.POSTGRES_DB,
		SESSION_COOKIES_EXPIRES_IN_DAYS: process.env.SESSION_COOKIES_EXPIRES_IN_DAYS,
		SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
		TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY
	},
	skipValidation: process.env.BUILD_TIME?.toLowerCase() === "true"
})

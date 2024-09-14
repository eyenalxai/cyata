import "server-only"

import { env } from "@/lib/env.mjs"
import { CaptchaValidation } from "@/lib/zod/api"
import { parseZodSchema } from "@/lib/zod/parse"
import ky from "ky"
import { ResultAsync } from "neverthrow"
import type { z } from "zod"

export const validateCaptcha = (turnstileResponse: string) => {
	const formData = new FormData()
	formData.append("secret", env.TURNSTILE_SECRET_KEY)
	formData.append("response", turnstileResponse)

	return ResultAsync.fromPromise(
		ky
			.post("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
				body: formData
			})
			.json<z.infer<typeof CaptchaValidation>>(),
		() => "Failed to validate captcha"
	).andThen((response) => parseZodSchema(CaptchaValidation, response))
}

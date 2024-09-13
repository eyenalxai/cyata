import "server-only"

import { env } from "@/lib/env.mjs"
import ky from "ky"
import { ResultAsync } from "neverthrow"

export const validateCaptcha = (turnstileResponse: string) => {
	const formData = new FormData()
	formData.append("secret", env.TURNSTILE_SECRET_KEY)
	formData.append("response", turnstileResponse)

	return ResultAsync.fromPromise(
		ky.post("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			body: formData
		}),
		() => "Failed to validate captcha"
	)
}

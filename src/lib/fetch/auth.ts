import { getErrorMessage } from "@/lib/error-message"
import { api } from "@/lib/fetch/fetcher"
import type { AuthFormSchema } from "@/lib/zod/form/auth"
import { ResultAsync } from "neverthrow"
import type { z } from "zod"

export const signUp = (signUpData: z.infer<typeof AuthFormSchema>) => {
	return ResultAsync.fromPromise(
		api("/api/auth/sign-up", {
			method: "post",
			json: signUpData
		}),
		(e) => getErrorMessage(e, "Failed to sign up")
	)
}

export const signIn = (signInData: z.infer<typeof AuthFormSchema>) => {
	return ResultAsync.fromPromise(
		api("/api/auth/sign-in", {
			method: "post",
			json: signInData
		}),
		(e) => getErrorMessage(e, "Failed to sign in")
	)
}

import { api } from "@/lib/fetch/fetcher"
import type { SignupFormSchema } from "@/lib/zod/form/sign-up"
import type { z } from "zod"

export const signUp = (signUpData: z.infer<typeof SignupFormSchema>) => {
	return api("/api/auth/sign-up", {
		method: "post",
		json: signUpData
	})
}

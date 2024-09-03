import { api } from "@/lib/fetch/fetcher"
import type { AuthFormSchema } from "@/lib/zod/form/auth"
import type { z } from "zod"

export const signUp = (signUpData: z.infer<typeof AuthFormSchema>) => {
	return api("/api/auth/sign-up", {
		method: "post",
		json: signUpData
	})
}

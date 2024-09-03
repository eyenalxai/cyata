import { z } from "zod"

export const SignupFormSchema = z.object({
	username: z.string().min(2, { message: "Username must be at least 2 characters long." }).trim(),
	password: z.string().min(2, { message: "Be at least 8 characters long" }).trim()
})

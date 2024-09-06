import { z } from "zod"

export const AuthType = z.enum(["sign-in", "sign-up"])

export const AuthFormSchema = z
	.object({
		type: AuthType,
		username: z.string().min(2, { message: "Must be at least 2 characters long." }).trim(),
		password: z.string().min(2, { message: "Must be at least 8 characters long" }).trim(),
		confirmPassword: z.string().min(2, { message: "Must be at least 8 characters long" }).trim().optional()
	})
	.refine(
		(data) => {
			if (data.type === "sign-up") return data.password === data.confirmPassword
			return true
		},
		{
			message: "Passwords must match"
		}
	)

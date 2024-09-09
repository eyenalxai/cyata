import { z } from "zod"

export const AuthType = z.enum(["sign-in", "sign-up"])
const Password = z.string().trim().min(2, { message: "Must be at least 8 characters long" })

export const AuthFormSchema = z
	.object({
		authType: AuthType,
		username: z.string().trim().min(2, { message: "Must be at least 2 characters long." }),
		password: Password,
		confirmPassword: z
			.union([z.string().length(0), Password])
			.optional()
			.transform((value) => (value === "" ? undefined : value))
	})
	.refine(
		(data) => {
			if (data.authType === "sign-up") return data.password === data.confirmPassword
			return true
		},
		{
			message: "Passwords must match"
		}
	)

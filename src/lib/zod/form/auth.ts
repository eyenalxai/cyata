import { z } from "zod"

export const AuthType = z.enum(["sign-in", "sign-up"])
const Password = z.string().trim().min(12, { message: "Password must be at least 12 characters long" })

export const AuthFormSchema = z
	.object({
		authType: AuthType,
		username: z.string().trim().min(3, { message: "Username must be at least 3 characters long." }),
		password: Password,
		"cf-turnstile-response": z
			.string()
			.trim()

			.refine((value) => value.length > 0, {
				message: "Please complete the Cloudflare CAPTCHA"
			}),
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

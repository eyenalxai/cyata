import {z} from "zod"

export const AuthType = z.enum(["sign-in", "sign-up"])
const Password = z
	.string()
	.trim()
	.min(12, { message: "Password must be at least 12 characters long" })
	.refine((value) => /[a-z]/.test(value), {
		message: "Password must contain at least one lowercase letter"
	})
	.refine((value) => /[A-Z]/.test(value), {
		message: "Password must contain at least one uppercase letter"
	})
	.refine((value) => /\d/.test(value), {
		message: "Password must contain at least one number"
	})
	.refine((value) => /[^a-zA-Z\d]/.test(value), {
		message: "Password must contain at least one special character"
	})

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
		repeatedPassword: z
			.union([z.string(), Password])
			.optional()
			.transform((value) => (value === "" ? undefined : value))
	})
	.refine(
		(data) => {
			if (data.authType === "sign-up") return data.password === data.repeatedPassword
			return true
		},
		{
			message: "Passwords must match"
		}
	)

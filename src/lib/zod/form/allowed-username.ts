import { z } from "zod"

export const AllowedUsernameFormSchema = z.object({
	username: z.string().trim().min(3, { message: "Username must be at least 3 characters long." }),
	note: z.string().trim().min(3, { message: "Note must be at least 3 characters long." }),
	telegram_username: z
		.string()
		.transform((value) => (value?.startsWith("@") ? value.slice(1) : value))
		.transform((value) => (value === "" ? undefined : value))
})

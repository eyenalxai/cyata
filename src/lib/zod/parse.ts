import { type Result, err, ok } from "neverthrow"
import type { ZodSchema } from "zod"

export const parseZodSchema = <T>(schema: ZodSchema<T>, data: unknown): Result<T, string> => {
	const result = schema.safeParse(data)

	if (result.success) return ok(result.data)

	return err(result.error.errors.map(({ message, path }) => `${path.join(".")}: ${message}`).join(", "))
}

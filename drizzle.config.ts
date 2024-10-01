import { buildDatabaseUrl } from "@/lib/utils"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/lib/schema.ts",
	out: "./drizzle",
	dbCredentials: {
		// url: process.env.DATABASE_URL!
		url: buildDatabaseUrl({
			// biome-ignore lint/style/noNonNullAssertion: This will be only run locally
			user: process.env.POSTGRES_USER!,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			password: process.env.POSTGRES_PASSWORD!,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			address: process.env.POSTGRES_ADDRESS!,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			database: process.env.POSTGRES_DB!
		})
	}
})

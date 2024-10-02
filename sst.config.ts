/// <reference path="./.sst/platform/config.d.ts" />
import { readFileSync } from "node:fs"

export default $config({
	app(input) {
		return {
			name: "cyata",
			removal: input?.stage === "production" ? "retain" : "remove",
			home: "local",
			providers: { nomad: true, random: "4.16.6" }
		}
	},
	async run() {
		const nomadUrl = process.env.NOMAD_URL
		if (!nomadUrl) throw new Error("NOMAD_URL is not set")

		const postgresPassword = process.env.POSTGRES_PASSWORD
		if (!postgresPassword) throw new Error("POSTGRES_PASSWORD is not set")

		const postgresUser = process.env.POSTGRES_USER
		if (!postgresUser) throw new Error("POSTGRES_USER is not set")

		const postgresDatabase = process.env.POSTGRES_DB
		if (!postgresDatabase) throw new Error("POSTGRES_DB is not set")

		const openAiApiKey = process.env.OPENAI_API_KEY
		if (!openAiApiKey) throw new Error("OPENAI_API_KEY is not set")

		const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY
		if (!turnstileSecretKey) throw new Error("TURNSTILE_SECRET_KEY is not set")

		const cyataImage = process.env.CYATA_IMAGE
		if (!cyataImage) throw new Error("CYATA_IMAGE is not set")

		const nomadProvider = new nomad.Provider("NomadProvider", {
			address: nomadUrl,
			skipVerify: true
		})

		const postgres = new nomad.Job(
			"Postgres",
			{
				jobspec: readFileSync(".nomad/postgres.nomad", "utf-8"),
				hcl2: {
					vars: {
						POSTGRES_PASSWORD: postgresPassword,
						POSTGRES_USER: postgresUser,
						POSTGRES_DB: postgresDatabase
					}
				}
			},
			{
				provider: nomadProvider
			}
		)
		const traefik = new nomad.Job(
			"Traefik",
			{
				jobspec: readFileSync(".nomad/traefik.nomad", "utf-8"),
				hcl2: {
					vars: {
						NOMAD_URL: nomadUrl
					}
				}
			},
			{
				provider: nomadProvider
			}
		)

		const frontend = new nomad.Job(
			"Cyata",
			{
				jobspec: readFileSync(".nomad/cyata.nomad", "utf-8"),
				hcl2: {
					vars: {
						POSTGRES_USER: postgresUser,
						POSTGRES_PASSWORD: postgresPassword,
						POSTGRES_DATABASE: postgresDatabase,
						OPENAI_API_KEY: $interpolate`${openAiApiKey}`,
						TURNSTILE_SECRET_KEY: $interpolate`${turnstileSecretKey}`,
						CYATA_IMAGE: cyataImage
					}
				}
			},
			{
				provider: nomadProvider
			}
		)
	}
})

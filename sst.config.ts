/// <reference path="./.sst/platform/config.d.ts" />

import { readFileSync } from "node:fs"

export default $config({
	app(input) {
		return {
			name: "cyata",
			removal: input?.stage === "production" ? "retain" : "remove",
			home: "local",
			providers: { nomad: true }
		}
	},
	async run() {
		const nomadAddress = "http://192.168.1.135:4646"

		const nomadProvider = new nomad.Provider("NomadProvider", {
			address: nomadAddress,
			skipVerify: true
		})

		const postgresPassword = new sst.Secret("PostgresPassword")
		const postgresUser = "elddry"
		const postgresDatabase = "cyata"

		const postgres = new nomad.Job(
			"Postgres",
			{
				jobspec: readFileSync(".nomad/postgres.nomad", "utf-8"),
				hcl2: {
					vars: {
						POSTGRES_PASSWORD: postgresPassword.value,
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
						NOMAD_ENDPOINT_ADDRESS: nomadAddress
					}
				}
			},
			{
				provider: nomadProvider
			}
		)

		const openAiApiKey = new sst.Secret("OpenAiApiKey")
		const turnstileSecretKey = new sst.Secret("TurnstileSecretKey")

		const frontend = new nomad.Job(
			"Cyata",
			{
				jobspec: readFileSync(".nomad/cyata.nomad", "utf-8"),
				hcl2: {
					vars: {
						DATABASE_URL: $interpolate`postgres://${postgresUser}:${postgresPassword.value}@192.168.1.135:5432/${postgresDatabase}`,
						OPENAI_API_KEY: $interpolate`${openAiApiKey.value}`,
						TURNSTILE_SECRET_KEY: $interpolate`${turnstileSecretKey.value}`
					}
				}
			},
			{
				provider: nomadProvider
			}
		)
	}
})

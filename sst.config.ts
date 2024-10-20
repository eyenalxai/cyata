/// <reference path="./.sst/platform/config.d.ts" />
import { readFileSync } from "node:fs"

const getEnvVariables = () => {
	const nomadUrl = process.env.NOMAD_URL
	if (!nomadUrl) throw new Error("NOMAD_URL is not set")

	const nomadToken = process.env.NOMAD_TOKEN
	if (!nomadToken) throw new Error("NOMAD_TOKEN is not set")

	const domain = process.env.DOMAIN
	if (!domain) throw new Error("DOMAIN is not set")

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

	const cfDnsApiToken = process.env.CF_DNS_API_TOKEN
	if (!cfDnsApiToken) throw new Error("CF_DNS_API_TOKEN is not set")

	return {
		nomadUrl,
		nomadToken,
		domain,
		postgresPassword,
		postgresUser,
		postgresDatabase,
		openAiApiKey,
		turnstileSecretKey,
		cyataImage,
		cfDnsApiToken
	}
}

export default $config({
	app(input) {
		return {
			name: "cyata",
			removal: input?.stage === "production" ? "retain" : "remove",
			home: "local",
			providers: { nomad: "2.4.0" }
		}
	},
	async run() {
		const {
			nomadUrl,
			nomadToken,
			domain,
			postgresPassword,
			postgresUser,
			postgresDatabase,
			openAiApiKey,
			turnstileSecretKey,
			cyataImage,
			cfDnsApiToken
		} = getEnvVariables()

		const nomadProvider = new nomad.Provider("NomadProvider", {
			address: nomadUrl,
			skipVerify: false,
			secretId: nomadToken
		})

		const traefikVariables = new nomad.Variable(
			"TraefikVariables",
			{
				path: "nomad/jobs/traefik",
				items: {
					nomad_url: nomadUrl,
					cf_dns_api_token: cfDnsApiToken
				}
			},
			{
				provider: nomadProvider
			}
		)

		const traefik = new nomad.Job(
			"Traefik",
			{
				jobspec: readFileSync(".nomad/traefik.nomad", "utf-8")
			},
			{
				provider: nomadProvider
			}
		)

		const frontendVariables = new nomad.Variable(
			"FrontendVariables",
			{
				path: "nomad/jobs/frontend",
				items: {
					postgres_user: postgresUser,
					postgres_password: postgresPassword,
					postgres_database: postgresDatabase,
					openai_api_key: openAiApiKey,
					turnstile_secret_key: turnstileSecretKey
				}
			},
			{
				provider: nomadProvider
			}
		)

		const frontend = new nomad.Job(
			"Frontend",
			{
				jobspec: readFileSync(".nomad/frontend.nomad", "utf-8"),
				hcl2: {
					vars: {
						CYATA_IMAGE: cyataImage,
						DOMAIN: domain
					}
				}
			},
			{
				provider: nomadProvider
			}
		)

		const postgresVariables = new nomad.Variable(
			"PostgresVariables",
			{
				path: "nomad/jobs/postgres",
				items: {
					postgres_user: postgresUser,
					postgres_password: postgresPassword,
					postgres_database: postgresDatabase
				}
			},
			{
				provider: nomadProvider
			}
		)

		const postgres = new nomad.Job(
			"Postgres",
			{
				jobspec: readFileSync(".nomad/postgres.nomad", "utf-8"),
				hcl2: {
					vars: {
						DOMAIN: domain
					}
				}
			},
			{
				provider: nomadProvider
			}
		)
	}
})

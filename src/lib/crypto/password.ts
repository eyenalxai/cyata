import { randomBytes, scrypt } from "node:crypto"
import { getErrorMessage } from "@/lib/error-message"
import { ResultAsync } from "neverthrow"

export const hashPassword = (password: string): ResultAsync<string, string> => {
	return ResultAsync.fromPromise(
		new Promise((resolve, reject) => {
			const salt = randomBytes(16).toString("hex")

			scrypt(password, salt, 64, (err, derivedKey) => {
				if (err) reject(err)
				resolve(`${salt}:${derivedKey.toString("hex")}`)
			})
		}),
		(e) => getErrorMessage(e, "Failed to get session by key")
	)
}

type VerifyPasswordProps = {
	password: string
	hash: string
}

export const verifyPassword = async ({ password, hash }: VerifyPasswordProps) =>
	new Promise((resolve, reject) => {
		const [salt, key] = hash.split(":")
		scrypt(password, salt, 64, (err, derivedKey) => {
			if (err) reject(err)
			resolve(key === derivedKey.toString("hex"))
		})
	})

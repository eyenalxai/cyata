import { randomBytes, scrypt } from "node:crypto"

export const hashPassword = (password: string): Promise<string> =>
	new Promise((resolve, reject) => {
		const salt = randomBytes(16).toString("hex")

		scrypt(password, salt, 64, (err, derivedKey) => {
			if (err) reject(err)
			resolve(`${salt}:${derivedKey.toString("hex")}`)
		})
	})

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

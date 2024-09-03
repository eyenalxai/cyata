import { randomBytes, scrypt } from "node:crypto"

export const hashPassword = (password: string): Promise<string> =>
	new Promise((resolve, reject) => {
		const salt = randomBytes(16).toString("hex")

		scrypt(password, salt, 64, (err, derivedKey) => {
			if (err) reject(err)
			resolve(`${salt}:${derivedKey.toString("hex")}`)
		})
	})

export const verifyPassword = async (password: string, hash: string): Promise<boolean> =>
	new Promise((resolve, reject) => {
		const [salt, key] = hash.split(":")
		scrypt(password, salt, 64, (err, derivedKey) => {
			if (err) reject(err)
			resolve(key === derivedKey.toString("hex"))
		})
	})

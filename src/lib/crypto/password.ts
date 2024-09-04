import { randomBytes, scrypt } from "node:crypto"
import { getErrorMessage } from "@/lib/error-message"
import { ResultAsync, errAsync, okAsync } from "neverthrow"

export const hashPassword = (password: string) => {
	return ResultAsync.fromPromise(
		new Promise<string>((resolve, reject) => {
			const salt = randomBytes(16).toString("hex")

			scrypt(password, salt, 64, (err, derivedKey) => {
				if (err) reject(err)
				resolve(`${salt}:${derivedKey.toString("hex")}`)
			})
		}),
		(e) => getErrorMessage(e, "Failed to hash password")
	)
}

type VerifyPasswordProps = {
	password: string
	hash: string
}

export const verifyPassword = ({ password, hash }: VerifyPasswordProps) => {
	return ResultAsync.fromPromise(
		new Promise<boolean>((resolve, reject) => {
			const [salt, key] = hash.split(":")
			scrypt(password, salt, 64, (err, derivedKey) => {
				if (err) reject(err)
				resolve(key === derivedKey.toString("hex"))
			})
		}),
		(e) => getErrorMessage(e, "Failed to verify password")
	).andThen((isPasswordCorrect) => {
		if (!isPasswordCorrect) return errAsync("Password is incorrect")
		return okAsync(isPasswordCorrect)
	})
}

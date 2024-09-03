import { randomBytes } from "node:crypto"

export const secureRandomToken = async () => randomBytes(64).toString("hex")

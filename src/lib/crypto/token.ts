import { randomBytes } from "node:crypto"

export const secureRandomToken = async () => randomBytes(32).toString("hex")

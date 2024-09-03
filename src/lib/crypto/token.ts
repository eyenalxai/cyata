import { randomBytes } from "node:crypto"

export const secureRandomToken = async () => randomBytes(256).toString("hex")

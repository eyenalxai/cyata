import { randomBytes } from "node:crypto"

export const secureRandomToken = () => randomBytes(32).toString("hex")

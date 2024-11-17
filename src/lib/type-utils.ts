import type { db } from "@/lib/database/client"
import type { ResultAsync } from "neverthrow"

export type AsyncOk<T> = T extends ResultAsync<infer U, unknown> ? U : never

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0] | typeof db

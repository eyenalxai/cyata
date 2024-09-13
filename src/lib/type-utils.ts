import type { ResultAsync } from "neverthrow"

export type AsyncOk<T> = T extends ResultAsync<infer U, unknown> ? U : never

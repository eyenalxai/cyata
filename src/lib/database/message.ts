import { getErrorMessage } from "@/lib/error-message"
import { type MessageInsert, messages } from "@/lib/schema"
import type { Transaction } from "@/lib/type-utils"
import { ResultAsync } from "neverthrow"

export const insertMessage = (tx: Transaction, message: MessageInsert) =>
	ResultAsync.fromPromise(tx.insert(messages).values(message).returning(), (e) =>
		getErrorMessage(e, "Failed to insert message")
	).map(([insertedMessage]) => insertedMessage)

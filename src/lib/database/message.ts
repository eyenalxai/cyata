import type { db } from "@/lib/database/client"
import { getErrorMessage } from "@/lib/error-message"
import { type MessageInsert, messages } from "@/lib/schema"
import { ResultAsync } from "neverthrow"

export const insertMessage = (tx: typeof db, message: MessageInsert) =>
	ResultAsync.fromPromise(tx.insert(messages).values(message).returning(), (e) =>
		getErrorMessage(e, "Failed to insert message")
	).map(([insertedMessage]) => insertedMessage)

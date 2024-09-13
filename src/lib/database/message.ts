import { db } from "@/lib/database/client"
import { getErrorMessage } from "@/lib/error-message"
import { type MessageInsert, messages } from "@/lib/schema"
import { ResultAsync } from "neverthrow"

export const insertMessage = (message: MessageInsert) =>
	ResultAsync.fromPromise(db.insert(messages).values(message).returning(), (e) =>
		getErrorMessage(e, "Failed to insert message")
	).map(([insertedMessage]) => insertedMessage)

import { db } from "@/lib/database/client"
import { getErrorMessage } from "@/lib/error-message"
import { type SessionInsert, sessions } from "@/lib/schema"
import { ResultAsync } from "neverthrow"

export const insertSession = (session: SessionInsert) => {
	return ResultAsync.fromPromise(db.insert(sessions).values(session).returning(), (e) =>
		getErrorMessage(e, "Failed to insert session")
	).map(([insertedSession]) => insertedSession)
}

import type { Message as DatabaseMessage } from "@/lib/schema"
import type { Message } from "ai"

export const mapMessages: (messages: DatabaseMessage[]) => Message[] = (messages: DatabaseMessage[]) => {
	return messages.map((message) => {
		return {
			id: message.uuid.toString(),
			content: message.content,
			role: message.role.toLowerCase()
		} as Message
	})
}

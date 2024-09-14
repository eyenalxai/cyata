import type { selectChatsWithMessages } from "@/lib/database/chat"
import type { AsyncOk } from "@/lib/type-utils"

export const groupChatsByInterval = (chats: AsyncOk<ReturnType<typeof selectChatsWithMessages>>) => {
	const now = new Date()
	const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
	const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
	const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
	const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

	const intervals = [
		{ start: oneDayAgo, end: now },
		{ start: twoDaysAgo, end: oneDayAgo },
		{ start: oneWeekAgo, end: twoDaysAgo },
		{ start: oneMonthAgo, end: oneWeekAgo }
	]

	const [chatsToday, chatsYesterday, chatsThisWeek, chatsThisMonth] = intervals.map((interval) =>
		chats
			.filter((chat) => {
				const chatDate = new Date(chat.createdAt)
				return chatDate >= interval.start && chatDate < interval.end
			})
			.map((chat) => ({
				title: chat.title || chat.messages[0].content,
				chatUuid: chat.uuid
			}))
	)

	const chatsRest = chats
		.filter((chat) => new Date(chat.createdAt) < oneMonthAgo)
		.map((chat) => ({
			title: chat.title || chat.messages[0].content,
			chatUuid: chat.uuid
		}))

	return {
		chatsToday,
		chatsYesterday,
		chatsThisWeek,
		chatsThisMonth,
		chatsRest
	}
}

"use client"

import type { UseChatHelpers } from "ai/react"

import { ButtonScrollToBottom } from "@/components/chat/button-scroll-to-bottom"
import { PromptForm } from "@/components/chat/prompt-form"
import { Button } from "@/components/ui/button"
import { savePartial } from "@/lib/fetch/chat"
import { cn } from "@/lib/utils"
import type { Message } from "ai"
import { User } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export interface ChatPanelProps extends Pick<UseChatHelpers, "append" | "isLoading" | "stop" | "input" | "setInput"> {
	messages: Message[]
	chatUuid: string
}

export const ChatPanel = ({ messages, isLoading, stop, append, input, setInput, chatUuid }: ChatPanelProps) => {
	const [savingPartial, setSavingPartial] = useState(false)

	return (
		<div className={cn("fixed", "inset-x-0", "bottom-0")}>
			<ButtonScrollToBottom />
			<div className={cn("mx-auto", "sm:max-w-2xl", "sm:px-4")}>
				<div className={cn('flex", "h-10", "items-center", "justify-center')}>
					{isLoading && (
						<Button
							variant="outline"
							onClick={() => {
								setSavingPartial(true)
								stop()
								savePartial({ messages, chatUuid }).match(
									() => setSavingPartial(false),
									(e) => {
										setSavingPartial(false)
										toast.error(e)
									}
								)
							}}
							className={cn("bg-background", "mb-6")}
						>
							<User className={cn("mr-2")} />
							Stop generating
						</Button>
					)}
				</div>
				<div
					className={cn(
						"space-y-4",
						"border-t",
						"bg-background",
						"px-4",
						"py-2",
						"shadow-lg",
						"sm:rounded-t-xl",
						"sm:border",
						"md:py-4"
					)}
				>
					<PromptForm
						onSubmit={async (value) => {
							await append({
								content: value,
								role: "user"
							})
						}}
						input={input}
						setInput={setInput}
						isLoading={isLoading || savingPartial}
					/>
				</div>
			</div>
		</div>
	)
}

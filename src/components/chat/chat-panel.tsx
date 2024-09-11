"use client"

import type { UseChatHelpers } from "ai/react"

import { ButtonScrollToBottom } from "@/components/chat/button-scroll-to-bottom"
import { PromptForm } from "@/components/chat/prompt-form"
import { Button } from "@/components/ui/button"
import { savePartial } from "@/lib/fetch/chat"
import { cn } from "@/lib/utils"
import type { OpenAIModel } from "@/lib/zod/model"
import type { Message } from "ai"
import { CircleStop, Pause, User } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import type { z } from "zod"

export interface ChatPanelProps extends Pick<UseChatHelpers, "append" | "isLoading" | "stop" | "input" | "setInput"> {
	messages: Message[]
	chatUuid: string
	model: z.infer<typeof OpenAIModel>
}

export const ChatPanel = ({ messages, isLoading, stop, append, input, setInput, chatUuid, model }: ChatPanelProps) => {
	const [savingPartial, setSavingPartial] = useState(false)

	return (
		<div className={cn("fixed", "inset-x-0", "bottom-0")}>
			<ButtonScrollToBottom />
			<div className={cn("mx-auto", "sm:max-w-2xl", "sm:px-4")}>
				<div className={cn("flex", "h-10", "items-center", "justify-center")}>
					{isLoading && (
						<Button
							variant="outline"
							onClick={async () => {
								setSavingPartial(true)
								stop()
								await savePartial({ messages, chatUuid, model }).match(
									() => setSavingPartial(false),
									(e) => {
										setSavingPartial(false)
										toast.error(e)
									}
								)
							}}
							className={cn("bg-background", "mb-6")}
						>
							<CircleStop className={cn("mr-2", "size-5")} />
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

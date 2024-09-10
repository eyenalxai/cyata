import type { UseChatHelpers } from "ai/react"
import * as React from "react"
import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit"
import { cn } from "@/lib/utils"
import { SendHorizontal } from "lucide-react"

interface PromptProps extends Pick<UseChatHelpers, "input" | "setInput"> {
	onSubmit: (value: string) => Promise<void>
	isLoading: boolean
}

export const PromptForm = ({ onSubmit, input, setInput, isLoading }: PromptProps) => {
	const { formRef, onKeyDown } = useEnterSubmit()
	const inputRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}, [])

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				if (!input?.trim()) {
					return
				}
				setInput("")
				inputRef.current?.blur()
				await onSubmit(input)
			}}
			ref={formRef}
		>
			<div
				className={cn(
					"relative",
					"flex",
					"max-h-60",
					"w-full",
					"grow",
					"flex-col",
					"overflow-hidden",
					"bg-background",
					"sm:rounded-md",
					"sm:border"
				)}
			>
				<Textarea
					disabled={isLoading}
					ref={inputRef}
					tabIndex={0}
					onKeyDown={onKeyDown}
					rows={1}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Send a message."
					spellCheck={false}
					className={cn(
						"min-h-[4.5rem]",
						"w-full",
						"resize-none",
						"bg-transparent",
						"p-4",
						"pl-8",
						"pr-20",
						"focus-within:outline-none",
						"sm:text-sm"
					)}
				/>
				<div className={cn("absolute", "right-0", "top-4", "sm:right-4")}>
					<Button
						type="submit"
						variant={"ghost"}
						disabled={isLoading || input === ""}
						className={cn("bg-transparent", "text-slate-500")}
					>
						<SendHorizontal />
						<span className="sr-only">Send message</span>
					</Button>
				</div>
			</div>
		</form>
	)
}

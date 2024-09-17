import type { UseChatHelpers } from "ai/react"
import * as React from "react"
import { type RefObject, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit"
import { cn } from "@/lib/utils"
import { SendHorizontal } from "lucide-react"

interface PromptProps extends Pick<UseChatHelpers, "input" | "setInput"> {
	onSubmit: (value: string) => Promise<void>
	isLoading: boolean
	inputRef: RefObject<HTMLTextAreaElement>
}

export const PromptForm = ({ onSubmit, input, setInput, isLoading, inputRef }: PromptProps) => {
	const { formRef, onKeyDown } = useEnterSubmit()

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}, [inputRef])

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()

				if (!input?.trim()) return

				setInput("")
				inputRef.current?.blur()

				if (inputRef.current) inputRef.current.style.height = "auto"
				window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })

				await onSubmit(input)
			}}
			ref={formRef}
		>
			<div
				className={cn("relative", "flex", "w-full", "grow", "flex-col", "bg-background", "sm:rounded-md", "sm:border")}
			>
				<Textarea
					disabled={isLoading}
					autoResize
					ref={inputRef}
					tabIndex={0}
					onKeyDown={onKeyDown}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Send a message."
					spellCheck={false}
					className={cn(
						"w-full",
						"bg-transparent",
						"p-4",
						"pl-8",
						"pr-20",
						"focus-within:outline-none",
						"sm:text-sm",
						"resize-none",
						"max-h-[60vh]"
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

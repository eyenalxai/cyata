import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type ArticleWrapperProps = {
	children: ReactNode
}

export const ArticleWrapper = ({ children }: ArticleWrapperProps) => {
	return (
		<article
			className={cn("max-w-none", "prose", "prose-slate", "dark:prose-invert", "break-words", [
				"prose-pre:bg-background",
				"prose-pre:text-primary",
				"prose-pre:p-0"
			])}
		>
			{children}
		</article>
	)
}

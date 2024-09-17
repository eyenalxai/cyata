import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type ArticleWrapperProps = {
	preserveNewlines?: boolean
	children: ReactNode
}

export const ArticleWrapper = ({ preserveNewlines, children }: ArticleWrapperProps) => {
	return (
		<article
			className={cn(
				"max-w-none",
				"prose",
				"prose-slate",
				"dark:prose-invert",
				["prose-pre:bg-background", "prose-pre:text-primary"],
				preserveNewlines && "whitespace-pre-wrap"
			)}
		>
			{children}
		</article>
	)
}

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type ArticleWrapperProps = {
	children: ReactNode
}

export const ArticleWrapper = ({ children }: ArticleWrapperProps) => {
	return (
		<article
			className={cn(
				"prose",
				"prose-slate",
				"dark:prose-invert",
				"prose-p:leading-relaxed",
				"prose-pre:p-0",
				"break-words"
			)}
		>
			{children}
		</article>
	)
}

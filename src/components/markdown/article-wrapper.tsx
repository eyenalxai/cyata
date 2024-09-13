import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type ArticleWrapperProps = {
	children: ReactNode
}

export const ArticleWrapper = ({ children }: ArticleWrapperProps) => {
	return <article className={cn("prose", "prose-slate", "dark:prose-invert", "break-words")}>{children}</article>
}

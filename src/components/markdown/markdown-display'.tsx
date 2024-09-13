import { MemoizedCodeComponent } from "@/components/code-block"
import { ArticleWrapper } from "@/components/markdown/article-wrapper"
import { isInline } from "@/lib/utils"
import { all } from "lowlight"
import { memo } from "react"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import rehypeSanitize from "rehype-sanitize"
import remarkMath from "remark-math"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"

type MarkdownDisplayProps = {
	markdown: string
}

const MarkdownDisplay = ({ markdown }: MarkdownDisplayProps) => (
	<ArticleWrapper>
		<Markdown
			remarkPlugins={[remarkParse, remarkMath, remarkRehype]}
			rehypePlugins={[rehypeSanitize, rehypeKatex, [rehypeHighlight, { languages: all }]]}
			components={{
				code(props) {
					if (isInline(props.children)) return <code {...props} />

					const match = /language-(\w+)/.exec(props.className || "")
					return <MemoizedCodeComponent key={Math.random()} {...props} language={match ? match[1] : ""} />
				}
			}}
		>
			{markdown}
		</Markdown>
	</ArticleWrapper>
)

export const MemoizedMarkdownDisplay = memo(MarkdownDisplay)

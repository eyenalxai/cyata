import { Button } from "@/components/ui/button"
import { copyToClipboard } from "@/lib/clipboard"
import { cn } from "@/lib/utils"
import { Check, Copy } from "lucide-react"
import { type FC, type HTMLAttributes, type ReactNode, memo, useState } from "react"
import { toast } from "sonner"

export interface CodeComponentProps extends HTMLAttributes<HTMLElement> {
	language?: string
}

const extractTextFromChildren = (children: ReactNode): string => {
	if (typeof children === "string") return children

	if (Array.isArray(children)) {
		return children.map(extractTextFromChildren).join("")
	}
	if (typeof children === "object" && children !== null && "props" in children) {
		return extractTextFromChildren(children.props.children)
	}
	return ""
}

export const CodeComponent: FC<CodeComponentProps> = ({ className, language, ...props }) => {
	const [isCopied, setIsCopied] = useState(false)

	const handleCopy = async (children: ReactNode) => {
		const text = extractTextFromChildren(children)
		await copyToClipboard(text).match(
			() => setIsCopied(true),
			(error) => toast.error(error)
		)
		setTimeout(() => setIsCopied(false), 1000)
	}

	return (
		<div className={cn("w-full", "border", "rounded-lg", "p-4")}>
			<div className={cn("flex", "flex-row", "justify-between", "items-start")}>
				<div className={cn("text-muted-foreground", "font-mono text-sm", "mb-4")}>{language}</div>
				<Button variant={"ghost"} size={"icon"} onClick={() => handleCopy(props.children)}>
					{isCopied ? <Check className={cn("size-5")} /> : <Copy className={cn("size-5")} />}
				</Button>
			</div>
			<code className={cn(className)} {...props} />
		</div>
	)
}

export const MemoizedCodeComponent = memo(CodeComponent)

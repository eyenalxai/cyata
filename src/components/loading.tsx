import { cn } from "@/lib/utils"
import { Loader } from "lucide-react"

type LoadingProps = {
	className?: string
}

export const Loading = ({ className }: LoadingProps) => (
	<div className={cn("w-full", "flex", "justify-center", "items-center", className)}>
		<Loader className={cn("animate-spin")} />
	</div>
)

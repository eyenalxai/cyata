import { cn } from "@/lib/utils"
import { Loader } from "lucide-react"

export const Loading = () => (
	<div className={cn("w-full", "flex", "justify-center", "items-center")}>
		<Loader className={cn("animate-spin")} />
	</div>
)

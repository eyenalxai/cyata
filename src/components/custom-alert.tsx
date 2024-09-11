import { Alert } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type CustomAlertProps = {
	children: ReactNode
}

export const CustomAlert = ({ children }: CustomAlertProps) => (
	<Alert
		className={cn(
			"bg-red-200",
			"dark:bg-red-900",
			"border-red-500",
			"dark:border-red-500",
			"text-red-900",
			"dark:text-red-200",
			"[&>svg]:stroke-red-900",
			"dark:[&>svg]:stroke-red-200"
		)}
		variant={"destructive"}
	>
		{children}
	</Alert>
)

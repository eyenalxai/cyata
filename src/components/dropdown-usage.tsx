"use client"

import { CustomAlert } from "@/components/custom-alert"
import { Loading } from "@/components/loading"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useUsage } from "@/lib/hooks/fetch/use-usage"
import { cn } from "@/lib/utils"
import type { Usage } from "@/lib/zod/api"
import { DollarSign } from "lucide-react"
import type { z } from "zod"

type UsageProps = {
	usages: z.infer<typeof Usage> | undefined
}

export const DropdownUsage = ({ usages }: UsageProps) => {
	const { usageResult, isLoading } = useUsage({ initialData: usages })

	if (isLoading) return <Loading />

	if (usageResult.isErr()) {
		return <CustomAlert>{usageResult.error}</CustomAlert>
	}

	const { usageCurrentMonth, usagePreviousMonth, usageTotal } = usageResult.value

	if (usageCurrentMonth === 0 && usagePreviousMonth === 0 && usageTotal === 0) return

	return (
		<DropdownMenuItem className={cn("pointer-events-none")}>
			<div className={cn("w-full", "flex", "flex-row", "justify-center", "items-start", "gap-x-2")}>
				<DollarSign className={cn("size-4", "mt-0.5")} />
				<div className={cn("flex", "flex-col", "justify-center", "items-stretch", "gap-y-1")}>
					{usageCurrentMonth > 0 && (
						<div className={cn("flex", "flex-row", "justify-between", "items-center", "gap-x-2")}>
							<span className={cn("text-xs")}>Current Month:</span>
							<span className={cn("text-xs")}>${usageCurrentMonth}</span>
						</div>
					)}
					{usagePreviousMonth > 0 && (
						<div className={cn("flex", "flex-row", "justify-between", "items-center", "gap-x-2")}>
							<span className={cn("text-xs")}>Previous Month:</span>
							<span className={cn("text-xs")}>${usagePreviousMonth}</span>
						</div>
					)}
					{usageTotal > 0 && (
						<div className={cn("flex", "flex-row", "justify-between", "items-center", "gap-x-2")}>
							<span className={cn("text-xs", "font-semibold")}>Total:</span>
							<span className={cn("text-xs", "font-semibold")}>${usageTotal}</span>
						</div>
					)}
				</div>
			</div>
		</DropdownMenuItem>
	)
}

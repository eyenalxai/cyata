"use client"

import { CustomAlert } from "@/components/custom-alert"
import { Loading } from "@/components/loading"
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import { useAllUsage } from "@/lib/hooks/fetch/use-all-usage"
import { cn } from "@/lib/utils"
import type { AllUsersUsage } from "@/lib/zod/api"
import type { z } from "zod"

type UsageTableProps = {
	initialAllUsage: z.infer<typeof AllUsersUsage>
}

export const UsageTable = ({ initialAllUsage }: UsageTableProps) => {
	const { allUsageResult, isLoading } = useAllUsage({ initialAllUsage })

	if (isLoading) return <Loading />

	if (allUsageResult.isErr()) {
		return <CustomAlert>{allUsageResult.error}</CustomAlert>
	}

	const totalAcrossAllUsers = allUsageResult.value.reduce((acc, userUsage) => acc + userUsage.usage.usageTotal, 0)

	return (
		<Table>
			<TableCaption>A list of all users and their usage</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Username</TableHead>
					<TableHead>Current Month</TableHead>
					<TableHead>Previous Month</TableHead>
					<TableHead className={cn("text-right")}>Total</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{allUsageResult.value
					.sort((a, b) => b.usage.usageTotal - a.usage.usageTotal)
					.map((userUsage) => (
						<TableRow key={userUsage.username}>
							<TableCell>{userUsage.username}</TableCell>
							<TableCell>${userUsage.usage.usageCurrentMonth}</TableCell>
							<TableCell>${userUsage.usage.usagePreviousMonth}</TableCell>
							<TableCell className={cn("text-right")}>${userUsage.usage.usageTotal}</TableCell>
						</TableRow>
					))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={3}>Total</TableCell>
					<TableCell className="text-right">${totalAcrossAllUsers}</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	)
}

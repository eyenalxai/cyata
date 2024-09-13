"use client"

import { CustomAlert } from "@/components/custom-alert"
import { Loading } from "@/components/loading"
import { Button } from "@/components/ui/button"
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
import { Ban, SmilePlus } from "lucide-react"
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
					<TableHead className={cn("font-semibold")}>Total</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{allUsageResult.value
					.sort((a, b) => b.usage.usageTotal - a.usage.usageTotal)
					.map((userUsage) => (
						<TableRow key={userUsage.user.username}>
							<TableCell>{userUsage.user.username}</TableCell>
							<TableCell>${userUsage.usage.usageCurrentMonth}</TableCell>
							<TableCell>${userUsage.usage.usagePreviousMonth}</TableCell>
							<TableCell className={cn("font-semibold")}>${userUsage.usage.usageTotal}</TableCell>
							<TableCell className={cn("p-1", "w-full", "flex", "justify-center", "items-center")}>
								<Button variant={"outline"} size={"icon"}>
									{userUsage.user.isRestricted ? (
										<SmilePlus className={cn("size-4")} />
									) : (
										<Ban className={cn("size-4")} />
									)}
								</Button>
							</TableCell>
						</TableRow>
					))}
			</TableBody>
			<TableFooter className={cn("bg-background")}>
				<TableRow>
					<TableCell colSpan={3}>Total</TableCell>
					<TableCell>${totalAcrossAllUsers}</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	)
}

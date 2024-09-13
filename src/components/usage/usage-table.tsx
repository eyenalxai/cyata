"use client"

import { CustomAlert } from "@/components/custom-alert"
import { Loading } from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAllUsage } from "@/lib/hooks/fetch/use-all-usage"
import { cn } from "@/lib/utils"
import type { AllUsersUsage } from "@/lib/zod/api"
import { Ban, SmilePlus } from "lucide-react"
import type { z } from "zod"

type UsageTableProps = {
	initialAllUsage: z.infer<typeof AllUsersUsage>
}

export const UsageTable = ({ initialAllUsage }: UsageTableProps) => {
	const { allUsageResult, isLoading, toggleIsRestricted, isTogglingIsRestricted } = useAllUsage({ initialAllUsage })

	if (isLoading) return <Loading />

	if (allUsageResult.isErr()) {
		return <CustomAlert>{allUsageResult.error}</CustomAlert>
	}

	const totalAcrossAllUsers = allUsageResult.value.reduce((acc, userUsage) => acc + userUsage.usage.usageTotal, 0)

	return (
		<div className={cn("w-full", "space-y-2")}>
			<h1 className={cn("text-2xl", "font-bold")}>Usage</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className={cn("text-start")}>Username</TableHead>
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
								<TableCell className={cn("text-start")}>{userUsage.user.username}</TableCell>
								<TableCell>${userUsage.usage.usageCurrentMonth}</TableCell>
								<TableCell>${userUsage.usage.usagePreviousMonth}</TableCell>
								<TableCell className={cn("font-semibold")}>${userUsage.usage.usageTotal}</TableCell>
								<TableCell className={cn("p-1", "w-full", "flex", "justify-center", "items-center")}>
									<Button
										disabled={isTogglingIsRestricted}
										onClick={() =>
											toggleIsRestricted({
												isRestricted: !userUsage.user.isRestricted,
												userUuid: userUsage.user.uuid
											})
										}
										variant={"outline"}
										size={"icon"}
									>
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
		</div>
	)
}

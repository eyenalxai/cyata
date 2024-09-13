import { CustomAlert } from "@/components/custom-alert"
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
import { selectUsagesForAllUsers } from "@/lib/database/usage"
import { cn } from "@/lib/utils"

export const UsageTable = async () => {
	const userUsagesResult = await selectUsagesForAllUsers()

	if (userUsagesResult.isErr()) return <CustomAlert>{userUsagesResult.error}</CustomAlert>

	const totalAcrossAllUsers = userUsagesResult.value.reduce((acc, userUsage) => acc + userUsage.usages.usageTotal, 0)

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
				{userUsagesResult.value
					.sort((a, b) => b.usages.usageTotal - a.usages.usageTotal)
					.map((userUsage) => (
						<TableRow key={userUsage.user.username}>
							<TableCell>{userUsage.user.username}</TableCell>
							<TableCell>${userUsage.usages.usageCurrentMonth}</TableCell>
							<TableCell>${userUsage.usages.usagePreviousMonth}</TableCell>
							<TableCell className={cn("text-right")}>${userUsage.usages.usageTotal}</TableCell>
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

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
import type { selectUsagesForAllUsers } from "@/lib/database/usage"
import type { AsyncOk } from "@/lib/type-utils"
import { cn } from "@/lib/utils"

const invoices = [
	{
		invoice: "INV001",
		paymentStatus: "Paid",
		totalAmount: "$250.00",
		paymentMethod: "Credit Card"
	},
	{
		invoice: "INV002",
		paymentStatus: "Pending",
		totalAmount: "$150.00",
		paymentMethod: "PayPal"
	},
	{
		invoice: "INV003",
		paymentStatus: "Unpaid",
		totalAmount: "$350.00",
		paymentMethod: "Bank Transfer"
	},
	{
		invoice: "INV004",
		paymentStatus: "Paid",
		totalAmount: "$450.00",
		paymentMethod: "Credit Card"
	},
	{
		invoice: "INV005",
		paymentStatus: "Paid",
		totalAmount: "$550.00",
		paymentMethod: "PayPal"
	},
	{
		invoice: "INV006",
		paymentStatus: "Pending",
		totalAmount: "$200.00",
		paymentMethod: "Bank Transfer"
	},
	{
		invoice: "INV007",
		paymentStatus: "Unpaid",
		totalAmount: "$300.00",
		paymentMethod: "Credit Card"
	}
]

type UsageTableProps = {
	userUsages: AsyncOk<ReturnType<typeof selectUsagesForAllUsers>>
}

export const UsageTable = ({ userUsages }: UsageTableProps) => {
	const totalAcrossAllUsers = userUsages.reduce((acc, userUsage) => acc + userUsage.usages.usageTotal, 0)

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
				{userUsages
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

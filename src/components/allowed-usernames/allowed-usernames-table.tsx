"use client"

import { CustomAlert } from "@/components/custom-alert"
import { Loading } from "@/components/loading"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAllowedUsernames } from "@/lib/hooks/fetch/use-allowed-usernames"
import { cn } from "@/lib/utils"
import type { AllowedUsernames } from "@/lib/zod/api"
import type { z } from "zod"

type UsageTableProps = {
	initialAllowedUsernames: z.infer<typeof AllowedUsernames>
}

export const AllowedUsernamesTable = ({ initialAllowedUsernames }: UsageTableProps) => {
	const { allowedUsernamesResult, isLoading } = useAllowedUsernames({ initialAllowedUsernames })

	if (isLoading) return <Loading />

	if (allowedUsernamesResult.isErr()) {
		return <CustomAlert>{allowedUsernamesResult.error}</CustomAlert>
	}

	return (
		<div className={cn("w-full", "space-y-2")}>
			<h1 className={cn("text-2xl", "font-bold")}>Allowed Usernames</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className={cn("text-start")}>Username</TableHead>
						<TableHead>Note</TableHead>
						<TableHead>Telegram</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{allowedUsernamesResult.value.map((allowedUsernameData) => (
						<TableRow key={allowedUsernameData.username}>
							<TableCell className={cn("text-start")}>{allowedUsernameData.username}</TableCell>
							<TableCell>{allowedUsernameData.note}</TableCell>
							<TableCell>{allowedUsernameData.telegram_username}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

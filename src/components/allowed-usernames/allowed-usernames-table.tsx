"use client"

import { CustomAlert } from "@/components/custom-alert"
import { Loading } from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAllowedUsernames } from "@/lib/hooks/fetch/use-allowed-usernames"
import { cn } from "@/lib/utils"
import type { AllowedUsernames } from "@/lib/zod/api"
import { AllowedUsernameFormSchema } from "@/lib/zod/form/allowed-username"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

type UsageTableProps = {
	initialAllowedUsernames: z.infer<typeof AllowedUsernames>
}

export const AllowedUsernamesTable = ({ initialAllowedUsernames }: UsageTableProps) => {
	const { allowedUsernamesResult, isLoading, addAllowedUsername, isAddingAllowedUsername } = useAllowedUsernames({
		initialAllowedUsernames
	})

	const form = useForm<z.infer<typeof AllowedUsernameFormSchema>>({
		resolver: zodResolver(AllowedUsernameFormSchema),
		defaultValues: {
			username: "",
			note: "",
			telegram_username: ""
		},
		disabled: isAddingAllowedUsername
	})

	const onSubmit = async (allowedUsernameData: z.infer<typeof AllowedUsernameFormSchema>) => {
		addAllowedUsername(allowedUsernameData)
		form.reset()
	}

	useEffect(() => {
		const errors = Object.values(form.formState.errors)
		for (const error of errors) {
			toast.error(error.message)
		}
	}, [form.formState.errors])

	if (isLoading) return <Loading />

	if (allowedUsernamesResult.isErr()) {
		return <CustomAlert>{allowedUsernamesResult.error}</CustomAlert>
	}

	return (
		<div className={cn("w-full", "flex", "flex-col", "justify-center", "items-start", "gap-y-2")}>
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
						<TableRow key={allowedUsernameData.username} className={cn("h-11")}>
							<TableCell className={cn("text-start")}>{allowedUsernameData.username}</TableCell>
							<TableCell>{allowedUsernameData.note}</TableCell>
							<TableCell>
								{allowedUsernameData.telegram_username && (
									<Button variant={"link"} className={cn("text-md", "h-4")} asChild>
										<a
											href={`https://t.me/${allowedUsernameData.telegram_username}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											@{allowedUsernameData.telegram_username}
										</a>
									</Button>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className={cn("w-full", "mt-4")}>
				<Label className={cn("ml-1")}>Add Allowed Username</Label>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className={cn("w-full", "flex", "flex-row", "justify-center", "items-center", "gap-x-2")}
					>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input className={cn("pr-8")} placeholder="Username" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="note"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input className={cn("pr-8")} placeholder="Note" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="telegram_username"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input className={cn("pr-8")} placeholder="Telegram" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<Button className={cn("w-fit")} type="submit">
							Save
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}

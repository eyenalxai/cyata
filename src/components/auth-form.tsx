"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn, signUp } from "@/lib/fetch/auth"
import { cn } from "@/lib/utils"
import { AuthFormSchema } from "@/lib/zod/form/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { LogIn } from "lucide-react"
import { useForm } from "react-hook-form"
import type { z } from "zod"

type AuthFormProps = {
	type: "sign-up" | "sign-in"
}

export function AuthForm({ type }: AuthFormProps) {
	const form = useForm<z.infer<typeof AuthFormSchema>>({
		resolver: zodResolver(AuthFormSchema),
		defaultValues: {
			username: "",
			password: ""
		}
	})

	const onSubmit = (authData: z.infer<typeof AuthFormSchema>) => {
		const action = type === "sign-up" ? signUp : signIn
		action(authData).then((response) => {
			console.log("success", response)
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-2", "w-full")}>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder="username" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input type={"password"} placeholder="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className={cn("w-full")} type="submit">
					<LogIn />
				</Button>
			</form>
		</Form>
	)
}

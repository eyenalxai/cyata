"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn, signUp } from "@/lib/fetch/auth"
import { cn } from "@/lib/utils"
import { AuthFormSchema } from "@/lib/zod/form/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Lock, User } from "lucide-react"
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
							<div className={cn("relative")}>
								<FormControl>
									<Input className={cn("pr-8")} placeholder="Username" {...field} />
								</FormControl>
								<User className={cn("absolute", "right-2", "top-2.5", "text-slate-500", "size-[1rem]")} />
							</div>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<div className={cn("relative")}>
								<FormControl>
									<Input className={cn("pr-8")} type={"password"} placeholder="Password" {...field} />
								</FormControl>
								<Lock className={cn("absolute", "right-2", "top-2.5", "text-slate-500", "size-[1rem]")} />
							</div>
						</FormItem>
					)}
				/>
				<Button className={cn("w-full")} type="submit">
					<span>Auth</span>
					<ArrowRight className={cn("size-5", "ml-2")} />
				</Button>
			</form>
		</Form>
	)
}

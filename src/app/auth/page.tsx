"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signIn, signUp } from "@/lib/fetch/auth"
import { cn } from "@/lib/utils"
import { AuthFormSchema, AuthType } from "@/lib/zod/form/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Lock, User } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { z } from "zod"

export default function Page() {
	const [authType, setAuthType] = useState<z.infer<typeof AuthType>>("sign-in")

	const form = useForm<z.infer<typeof AuthFormSchema>>({
		resolver: zodResolver(AuthFormSchema),
		defaultValues: {
			username: "",
			password: "",
			confirmPassword: ""
		}
	})

	const onSubmit = (authData: z.infer<typeof AuthFormSchema>) => {
		const action = authType === "sign-up" ? signUp : signIn
		action(authData).then((response) => {
			console.log("success", response)
		})
	}

	return (
		<div className={cn("w-full", "mt-12", "flex", "flex-col", "items-center")}>
			<div className={cn("w-full", "max-w-md", "flex", "flex-col", "items-center", "gap-y-2")}>
				<Tabs className={cn("w-full")} value={authType} onValueChange={(tab) => setAuthType(AuthType.parse(tab))}>
					<TabsList className={cn("w-full")}>
						<TabsTrigger className={cn("w-full")} value="sign-in">
							Sign In
						</TabsTrigger>
						<TabsTrigger className={cn("w-full")} value="sign-up">
							Sign Up
						</TabsTrigger>
					</TabsList>
				</Tabs>
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
										<User className={cn("absolute", "right-2", "top-2.5", "text-slate-500", "size-4")} />
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<div className={cn("relative", "z-20")}>
										<FormControl>
											<Input
												className={cn("pr-8", "bg-background")}
												type={"password"}
												placeholder="Password"
												{...field}
											/>
										</FormControl>
										<Lock className={cn("absolute", "right-2", "top-2.5", "text-slate-500", "size-4")} />
									</div>
								</FormItem>
							)}
						/>
						<AnimatePresence>
							{authType === "sign-up" && (
								<motion.div
									transition={{
										ease: "easeOut",
										duration: 0.3
									}}
									initial={{ y: "-2.75rem" }}
									animate={{ y: 0 }}
									exit={{ y: "-2.75rem" }}
								>
									<FormField
										control={form.control}
										name="confirmPassword"
										render={({ field }) => (
											<FormItem>
												<div className={cn("relative", "z-10")}>
													<FormControl>
														<Input
															className={cn("pr-8", "bg-background")}
															type={"password"}
															placeholder="Confirm password"
															{...field}
														/>
													</FormControl>
													<Lock className={cn("absolute", "right-2", "top-2.5", "text-slate-500", "size-4")} />
												</div>
											</FormItem>
										)}
									/>
								</motion.div>
							)}
						</AnimatePresence>
						<Button className={cn("w-full")} type="submit">
							<span>Auth</span>
							<ArrowRight className={cn("size-5", "ml-2")} />
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}

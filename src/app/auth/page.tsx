"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { env } from "@/lib/env.mjs"
import { signIn, signUp } from "@/lib/fetch/auth"
import { cn } from "@/lib/utils"
import { AuthFormSchema, AuthType } from "@/lib/zod/form/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { ArrowRight, Loader, Lock, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

export const dynamic = "force-dynamic"

export default function Page() {
	const router = useRouter()
	const [authType, setAuthType] = useState<z.infer<typeof AuthType>>("sign-in")
	const [isSubmitting, startTransition] = useTransition()

	const tabs = ["sign-in", "sign-up"] satisfies z.infer<typeof AuthType>[]
	const tabNames: Record<z.infer<typeof AuthType>, string> = {
		"sign-in": "Sign In",
		"sign-up": "Sign Up"
	}

	const form = useForm<z.infer<typeof AuthFormSchema>>({
		resolver: zodResolver(AuthFormSchema),
		defaultValues: {
			authType: "sign-in",
			username: "",
			password: "",
			repeatedPassword: "",
			"cf-turnstile-response": ""
		}
	})

	const turnstileRef = useRef<TurnstileInstance>()
	const cfTurnstileResponse = form.watch("cf-turnstile-response")

	useEffect(() => {
		if (cfTurnstileResponse !== "") return

		if (!turnstileRef.current) return

		const intervalId = setInterval(() => {
			const response = turnstileRef.current?.getResponse()
			if (response) {
				clearInterval(intervalId)
				form.setValue("cf-turnstile-response", response)
			}
		}, 300)

		return () => clearInterval(intervalId)
	}, [form, cfTurnstileResponse])

	const onSubmit = async (authData: z.infer<typeof AuthFormSchema>) => {
		const action = authType === "sign-up" ? signUp : signIn
		startTransition(async () => {
			await action(authData).match(
				() => router.push(`/chat/${window.crypto.randomUUID()}`),
				(e) => {
					toast.error(e)
					turnstileRef.current?.reset()
					form.setValue("cf-turnstile-response", "")
				}
			)
		})
	}

	useEffect(() => {
		form.setValue("authType", authType)
	}, [form, authType])

	useEffect(() => {
		const errors = Object.values(form.formState.errors)
		if (errors.length === 0) return

		for (const error of errors) {
			toast.error(error.message)
		}
	}, [form, form.formState.errors])

	return (
		<div className={cn("w-full", "mt-12", "flex", "flex-col", "items-center", "px-4")}>
			<MotionConfig
				transition={{
					type: "spring",
					duration: 0.5,
					bounce: 0.1
				}}
			>
				<div className={cn("w-full", "max-w-md", "flex", "flex-col", "items-center", "gap-y-2")}>
					<div
						className={cn(
							"w-full",
							"flex",
							"flex-row",
							"justify-center",
							"items-center",
							"bg-muted",
							"p-1",
							"rounded-lg",
							"gap-x-2"
						)}
					>
						{tabs.map((tab) => (
							<Button
								key={tab}
								onClick={() => setAuthType(AuthType.parse(tab))}
								onFocus={() => setAuthType(AuthType.parse(tab))}
								variant={"ghost"}
								className={cn(
									"w-full",
									"relative",
									"hover:bg-transparent",
									"bg-transparent",
									"text-sm",
									"h-7",
									"focus-visible:ring-0",
									authType === tab
										? ["text-primary", "hover:text-primary"]
										: ["text-muted-foreground", "hover:text-muted-foreground"]
								)}
							>
								{authType === tab ? (
									<motion.div
										layoutId="tab-indicator"
										className={cn("absolute", "inset-0", "rounded-lg", "bg-background", "shadow", "z-10")}
									/>
								) : null}
								<span className={cn("z-20")}>{tabNames[tab]}</span>
							</Button>
						))}
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-2", "w-full")}>
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<label htmlFor={field.name} className="sr-only">
											Username
										</label>
										<div className={cn("relative")}>
											<FormControl>
												<Input
													id={field.name}
													autoComplete={"username"}
													className={cn("pr-8")}
													placeholder="Username"
													{...field}
												/>
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
											<label htmlFor={field.name} className="sr-only">
												Password
											</label>
											<FormControl>
												<Input
													id={field.name}
													autoComplete={authType === "sign-up" ? "new-password" : "current-password"}
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
							<motion.div
								initial={false}
								animate={{
									y: authType === "sign-in" ? "-2.75rem" : 0
								}}
								className={cn("w-full", "space-y-2")}
							>
								<FormField
									control={form.control}
									name="repeatedPassword"
									render={({ field }) => (
										<FormItem>
											<div className={cn("relative", "z-10")}>
												<label htmlFor={field.name} className="sr-only">
													Repeat Password
												</label>
												<FormControl>
													<Input
														id={field.name}
														disabled={authType === "sign-in"}
														autoComplete={"new-password"}
														className={cn("pr-8", "bg-background", "disabled:opacity-0", [
															"transition-opacity",
															"duration-300",
															"ease-out"
														])}
														type={"password"}
														placeholder="Repeat Password"
														{...field}
													/>
												</FormControl>
												<Lock className={cn("absolute", "right-2", "top-2.5", "text-slate-500", "size-4")} />
											</div>
										</FormItem>
									)}
								/>
								<Button className={cn("w-full", "h-9")} type="submit">
									<AnimatePresence mode="popLayout" initial={false}>
										<motion.div
											initial={{ opacity: 0, y: -25 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: 25 }}
											key={isSubmitting ? "loading" : "auth"}
										>
											{isSubmitting ? (
												<Loader className={cn("size-5", "animate-spin")} />
											) : (
												<div className={cn("w-full", "flex", "flex-row", "justify-center", "items-center", "gap-x-1")}>
													<span>Auth</span>
													<ArrowRight className={cn("size-5")} />
												</div>
											)}
										</motion.div>
									</AnimatePresence>
								</Button>
								<div className={cn("w-full", "flex", "justify-center", "items-center")}>
									<Turnstile
										injectScript={false}
										siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
										scriptOptions={{ id: "turnstile-script" }}
										onExpire={() => {
											turnstileRef.current?.reset()
											form.setValue("cf-turnstile-response", "")
										}}
										onError={() => {
											turnstileRef.current?.reset()
											form.setValue("cf-turnstile-response", "")
										}}
										ref={turnstileRef}
									/>
								</div>
							</motion.div>
						</form>
					</Form>
				</div>
			</MotionConfig>
		</div>
	)
}

import { cn } from "@/lib/utils"
import Script from "next/script"
import type { ReactNode } from "react"

export default function ChatLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Script
				id="turnstile-script"
				src="https://challenges.cloudflare.com/turnstile/v0/api.js"
				strategy="beforeInteractive"
			/>
			<main className={cn("container", "mx-auto", "max-w-5xl", "p-4")}>{children}</main>
		</>
	)
}

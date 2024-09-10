import { Header } from "@/components/header"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export default function ChatLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Header />
			<main className={cn("container", "mx-auto", "max-w-5xl", "p-4")}>{children}</main>
		</>
	)
}

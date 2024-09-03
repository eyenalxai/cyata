import { SignupForm } from "@/components/signup-form"
import { cn } from "@/lib/utils"

export default function Home() {
	return (
		<div className={cn("w-full", "flex", "justify-center", "mt-12")}>
			<SignupForm />
		</div>
	)
}

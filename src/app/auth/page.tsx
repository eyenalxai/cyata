import { AuthForm } from "@/components/auth-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export default function Page() {
	return (
		<div className={cn("w-full", "flex", "justify-center", "mt-12")}>
			<Tabs defaultValue="sign-in">
				<TabsList className={cn("w-full")}>
					<TabsTrigger className={cn("w-full")} value="sign-in">
						Sign In
					</TabsTrigger>
					<TabsTrigger className={cn("w-full")} value="sign-up">
						Sign Up
					</TabsTrigger>
				</TabsList>
				<TabsContent value="sign-in">
					<AuthForm type={"sign-in"} />
				</TabsContent>
				<TabsContent value="sign-up">
					<AuthForm type={"sign-up"} />
				</TabsContent>
			</Tabs>
		</div>
	)
}

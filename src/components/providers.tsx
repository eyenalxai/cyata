"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider, isServer } from "@tanstack/react-query"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

const makeQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000
			}
		}
	})

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
	if (isServer) return makeQueryClient()

	if (!browserQueryClient) browserQueryClient = makeQueryClient()
	return browserQueryClient
}

export const Providers = ({ children, ...props }: ThemeProviderProps) => {
	const queryClient = getQueryClient()

	return (
		<NextThemesProvider {...props}>
			<QueryClientProvider client={queryClient}>
				<SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
			</QueryClientProvider>
			<Toaster />
		</NextThemesProvider>
	)
}

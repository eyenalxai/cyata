import { type ClassValue, clsx } from "clsx"
import { Children, type ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const isInline = (children: ReactNode): boolean => {
	for (const child of Children.toArray(children)) {
		if (typeof child === "string" && child.includes("\n")) {
			return false
		}
	}

	return true
}

type BuildDatabaseUrlProps = {
	user: string
	password: string
	address: string
	database: string
}

export const buildDatabaseUrl = ({ user, password, address, database }: BuildDatabaseUrlProps) => {
	return `postgres://${user}:${password}@${address}/${database}`
}

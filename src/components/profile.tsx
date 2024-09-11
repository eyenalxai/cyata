"use client"

import { SelectModel } from "@/components/chat/select-model"
import { CustomAlert } from "@/components/custom-alert"
import { Loading } from "@/components/loading"
import { Label } from "@/components/ui/label"
import { usePreferences } from "@/lib/hooks/fetch/use-preferences"
import { cn } from "@/lib/utils"
import type { PreferencesResponse } from "@/lib/zod/api"
import type { z } from "zod"

type ProfileProps = {
	initialData: z.infer<typeof PreferencesResponse> | undefined
}

export const Profile = ({ initialData }: ProfileProps) => {
	const { preferencesResult, isLoading, updateDefaultModel } = usePreferences({ initialData })

	if (isLoading) return <Loading />

	if (preferencesResult.isErr()) {
		return <CustomAlert>{preferencesResult.error}</CustomAlert>
	}

	return (
		<div className={cn("flex", "flex-col", "justify-start", "items-start", "gap-y-1")}>
			<Label className={cn("ml-1")}>Default model</Label>
			<SelectModel model={preferencesResult.value.defaultModel} setModel={updateDefaultModel} />
		</div>
	)
}

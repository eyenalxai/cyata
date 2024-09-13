"use client"

import { SelectModel } from "@/components/chat/select-model"
import { CustomAlert } from "@/components/custom-alert"
import { Loading } from "@/components/loading"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { usePreferences } from "@/lib/hooks/fetch/use-preferences"
import { cn } from "@/lib/utils"
import type { PreferencesResponse } from "@/lib/zod/api"
import type { z } from "zod"

type ProfileProps = {
	initialData: z.infer<typeof PreferencesResponse> | undefined
}

export const Profile = ({ initialData }: ProfileProps) => {
	const { preferencesResult, isLoading, updateDefaultModel, updateSystemPrompt } = usePreferences({ initialData })

	if (isLoading) return <Loading />

	if (preferencesResult.isErr()) {
		return <CustomAlert>{preferencesResult.error}</CustomAlert>
	}

	return (
		<div className={cn("max-w-screen-sm", "flex", "flex-col", "justify-center", "items-start", "gap-y-4")}>
			<h1 className={cn("text-2xl", "font-bold")}>Settings</h1>
			<div className={cn("flex", "flex-col", "justify-start", "items-start", "gap-y-1")}>
				<Label className={cn("ml-1")}>Default model</Label>
				<SelectModel model={preferencesResult.value.defaultModel} setModel={updateDefaultModel} />
			</div>
			<div className={cn("w-full", "flex", "flex-col", "justify-start", "items-start", "gap-y-1")}>
				<Label className={cn("ml-1")}>Default System Prompt</Label>
				<Textarea
					autoResize
					rows={Math.max(preferencesResult.value.systemPrompt.split("\n").length, 4)}
					onChange={(event) => updateSystemPrompt(event.target.value)}
					defaultValue={preferencesResult.value.systemPrompt}
				/>
			</div>
		</div>
	)
}

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { type OpenAIModel, selectOpenAiModelOptions } from "@/lib/zod/model"
import type { z } from "zod"

type SelectModelProps = {
	model: z.infer<typeof OpenAIModel>
	setModel: (model: z.infer<typeof OpenAIModel>) => void
}

export const SelectModel = ({ model, setModel }: SelectModelProps) => (
	<Select onValueChange={(model) => setModel(model as z.infer<typeof OpenAIModel>)} value={model}>
		<SelectTrigger className={cn("w-32")}>
			<SelectValue>{selectOpenAiModelOptions[model as keyof typeof selectOpenAiModelOptions]}</SelectValue>
		</SelectTrigger>
		<SelectContent>
			{Object.entries(selectOpenAiModelOptions).map(([key, value]) => {
				return (
					<SelectItem key={key} value={key}>
						{value}
					</SelectItem>
				)
			})}
		</SelectContent>
	</Select>
)

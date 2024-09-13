import { CustomAlert } from "@/components/custom-alert"
import { UsageTable } from "@/components/usage/usage-table"
import { selectUsagesForAllUsers } from "@/lib/database/usage"

export const UsageServer = async () => {
	const allUsageResult = await selectUsagesForAllUsers()

	if (allUsageResult.isErr()) {
		return <CustomAlert>{allUsageResult.error}</CustomAlert>
	}

	return <UsageTable initialAllUsage={allUsageResult.value} />
}

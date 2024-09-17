import { CustomAlert } from "@/components/custom-alert"
import { UsageTable } from "@/components/usage/usage-table"
import { db } from "@/lib/database/client"
import { selectUsagesForAllUsers } from "@/lib/database/usage"

export const UsageServer = async () => {
	const allUsageResult = await selectUsagesForAllUsers(db)

	if (allUsageResult.isErr()) {
		return <CustomAlert>{allUsageResult.error}</CustomAlert>
	}

	return <UsageTable initialAllUsage={allUsageResult.value} />
}

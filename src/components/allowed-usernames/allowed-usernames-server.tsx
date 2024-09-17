import { AllowedUsernamesTable } from "@/components/allowed-usernames/allowed-usernames-table"
import { CustomAlert } from "@/components/custom-alert"
import { selectAllowedUsernames } from "@/lib/database/allowed-username"
import { db } from "@/lib/database/client"

export const AllowedUsernamesServer = async () => {
	const allowedUsernamesResult = await selectAllowedUsernames(db)

	if (allowedUsernamesResult.isErr()) {
		return <CustomAlert>{allowedUsernamesResult.error}</CustomAlert>
	}

	return <AllowedUsernamesTable initialAllowedUsernames={allowedUsernamesResult.value} />
}

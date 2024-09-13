import { AllowedUsernamesTable } from "@/components/allowed-usernames/allowed-usernames-table"
import { CustomAlert } from "@/components/custom-alert"
import { selectAllowedUsernames } from "@/lib/database/allowed-username"

export const AllowedUsernamesServer = async () => {
	const allowedUsernamesResult = await selectAllowedUsernames()

	if (allowedUsernamesResult.isErr()) {
		return <CustomAlert>{allowedUsernamesResult.error}</CustomAlert>
	}

	return <AllowedUsernamesTable initialAllowedUsernames={allowedUsernamesResult.value} />
}

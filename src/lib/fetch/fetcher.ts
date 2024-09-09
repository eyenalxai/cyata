"use client"

import ky, { HTTPError, type Input as KyInput, type Options as KyOption } from "ky"

export const api = async (url: KyInput, options?: KyOption) => {
	try {
		return await ky(url, {
			...options,
			credentials: "include"
		})
	} catch (e) {
		if (e instanceof HTTPError) throw new Error(await e.response.text())
		throw e
	}
}

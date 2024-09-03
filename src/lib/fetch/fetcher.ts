"use client"

import ky, { type Input as KyInput, type Options as KyOption } from "ky"

export const api = (url: KyInput, options?: KyOption) => {
	return ky(url, {
		...options,
		credentials: "include"
	})
}

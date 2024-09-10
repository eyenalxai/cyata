"use client"

import ky, { HTTPError, type Input as KyInput, type Options as KyOptions } from "ky"

type NonDefaultType<T> = unknown extends T ? never : T

interface ExtendedOptions extends KyOptions {
	shouldParseJson?: boolean
}

export async function api<T>(
	url: KyInput,
	options: ExtendedOptions & { shouldParseJson: true }
): Promise<NonDefaultType<T>>
export async function api(url: KyInput, options: ExtendedOptions): Promise<Response>

export async function api<T = unknown>(url: KyInput, options: ExtendedOptions): Promise<T | Response> {
	try {
		const response = await ky(url, {
			...options,
			credentials: "include"
		})

		if (options.shouldParseJson) return (await response.json()) as Promise<T>

		return response
	} catch (e) {
		if (e instanceof HTTPError) throw new Error(await e.response.text())
		throw e
	}
}

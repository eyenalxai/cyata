import { useEffect, useState } from "react"

export function useAtBottom(offset = 0) {
	const [isAtBottom, setIsAtBottom] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			const atBottom = Math.ceil(window.innerHeight + window.scrollY) >= Math.floor(document.body.offsetHeight - offset)
			setIsAtBottom(atBottom)
		}

		window.addEventListener("scroll", handleScroll, { passive: true })
		handleScroll()

		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [offset])

	return isAtBottom
}

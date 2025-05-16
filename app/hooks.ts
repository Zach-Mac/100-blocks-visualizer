import { useState, useEffect } from 'react'
import { ZodType } from 'zod'

function useLocalStorage<T>(key: string, initialValue: T) {
	const [hydrated, setHydrated] = useState(false)
	const [value, setValue] = useState<T>(initialValue)

	useEffect(() => {
		const stored = localStorage.getItem(key)
		if (stored) setValue(JSON.parse(stored))
		setHydrated(true)
	}, [key])

	useEffect(() => {
		if (hydrated) localStorage.setItem(key, JSON.stringify(value))
	}, [key, value, hydrated])

	return [value, setValue] as const
}

export function useZodLocalStorage<T>(key: string, schema: ZodType<T>, fallback: T) {
	const [raw, setRaw] = useLocalStorage(key, fallback)
	const parsed = schema.safeParse(raw)
	const value = parsed.success ? parsed.data : fallback
	return [value, setRaw] as const
}

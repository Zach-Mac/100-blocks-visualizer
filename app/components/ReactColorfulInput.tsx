'use client'
import { useState, useRef, useEffect } from 'react'
import { HslStringColorPicker } from 'react-colorful'

export default function ReactColorfulInput({
	color,
	onChange
}: {
	color: string
	onChange: (color: string) => void
}) {
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setOpen(false)
			}
		}
		if (open) {
			document.addEventListener('mousedown', handleClickOutside)
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [open])

	return (
		<div className="relative" ref={ref} onClick={e => e.stopPropagation()}>
			<div
				className="w-6 h-6 rounded-lg mr-2 cursor-pointer border border-gray-300"
				style={{ backgroundColor: color }}
				onClick={e => setOpen(o => !o)}
			/>
			{open && (
				<div className="absolute z-10 top-8 left-0 bg-white p-2 rounded-lg shadow-lg">
					<HslStringColorPicker color={color} onChange={onChange} />
				</div>
			)}
		</div>
	)
}

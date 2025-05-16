'use client'
import CopyButton from '@/app/components/CopyButton'
import { useState, useRef, useEffect } from 'react'
import { HexColorInput, HslStringColorPicker } from 'react-colorful'
import Color from 'color'

export default function ReactColorfulInput({
	color,
	onChange
}: {
	color: string
	onChange: (color: string) => void
}) {
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>(null)
	const popoverRef = useRef<HTMLDivElement>(null)

	const hexColor = Color(color).hex()

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

	// Focus the popover when it opens for keyboard accessibility
	useEffect(() => {
		if (open && popoverRef.current) {
			popoverRef.current.focus()
		}
	}, [open])

	const handleColorChange = (newColor: string) => {
		const parsedColor = Color(newColor).hsl().string()
		onChange(parsedColor)
	}

	const handlePopoverKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Escape') {
			setOpen(false)
		}
	}

	return (
		<div className="relative" ref={ref} onClick={e => e.stopPropagation()}>
			<div
				className="mr-2 h-6 w-6 cursor-pointer rounded-lg border border-gray-300"
				style={{ backgroundColor: color }}
				onClick={() => setOpen(o => !o)}
			/>
			{open && (
				<div
					ref={popoverRef}
					tabIndex={-1}
					onKeyDown={handlePopoverKeyDown}
					className="absolute top-10 left-0 z-20 flex cursor-default flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl"
				>
					<HslStringColorPicker
						color={color}
						onChange={handleColorChange}
						className="cursor-pointer"
					/>
					<div className="flex items-center gap-1">
						<span className="text- font-mono text-gray-500">#</span>
						<HexColorInput
							color={hexColor}
							onChange={handleColorChange}
							prefixed={false}
							className="w-44 rounded-lg border border-gray-300 px-2 py-1 font-mono text-gray-800 transition focus:ring-2 focus:ring-blue-400 focus:outline-none"
							placeholder="RRGGBB"
						/>
						<CopyButton
							value={hexColor}
							iconOnly
							className="btn-min btn-hover p-2"
							iconColor="text-gray-500"
						/>
					</div>
				</div>
			)}
		</div>
	)
}

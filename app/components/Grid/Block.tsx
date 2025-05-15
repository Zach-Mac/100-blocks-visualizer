'use client'
import type { Block } from '@/app/types'
import { useGlobalState, useGrid } from '@/app/components/Provider'
import { scaledVariants } from '@/app/motion'
import { motion } from 'motion/react'

function getTimeString(minutes: number) {
	const h = Math.floor(minutes / 60) % 24
	const m = minutes % 60
	return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export default function Block({
	block,
	isHovered,
	index,
	onMouseDown,
	onMouseEnter,
	onMouseLeave
}: {
	block: Block
	isHovered: boolean
	index: number
	onMouseDown: (e: React.MouseEvent) => void
	onMouseEnter: (e: React.MouseEvent) => void
	onMouseLeave: (e: React.MouseEvent) => void
}) {
	const { getActivity } = useGlobalState()
	const { grid } = useGrid()

	const gridStartTime = grid.state.startTime

	const activity = getActivity(block.activityId)

	const [hours, minutes] = gridStartTime.split(':').map(Number)

	const totalMinutesStart = hours * 60 + minutes + index * 10
	const totalMinutesEnd = totalMinutesStart + 10

	return (
		<div
			key={index}
			className="group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded transition-opacity"
			style={{
				backgroundColor: activity?.color || '#ffffff'
			}}
			title={activity?.name}
			onMouseDown={onMouseDown}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{isHovered && (
				<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 font-mono text-xs font-semibold text-white">
					<div className="flex items-center">
						<span>{getTimeString(totalMinutesStart)}</span>
						<span>-</span>
					</div>
					<div className="flex items-center">
						<span>{getTimeString(totalMinutesEnd)}</span>
						<span className="opacity-0">-</span>
					</div>
				</div>
			)}
		</div>
	)
}

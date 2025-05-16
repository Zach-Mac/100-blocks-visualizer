'use client'
import type { Block } from '@/app/types'
import { useGlobalState, useGrid, BLOCK_SIZE } from '@/app/components/Provider'
import BlockContent from '@/app/components/Grid/BlockContent'

function getTimeString(minutes: number) {
	const h = Math.floor(minutes / 60) % 24
	const m = minutes % 60
	return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

interface BlockProps {
	block: Block
	isHovered: boolean
	index: number
	isNow?: boolean
	onMouseDown: (e: React.MouseEvent) => void
	onMouseEnter: (e: React.MouseEvent) => void
	onMouseLeave: (e: React.MouseEvent) => void
}

const DEFAULT_BLOCK_COLOR = '#ffffff'

export default function Block({
	block,
	index,
	isHovered,
	isNow,
	onMouseDown,
	onMouseEnter,
	onMouseLeave
}: BlockProps) {
	const { getActivity } = useGlobalState()
	const { grid } = useGrid()

	const gridStartTime = grid.state.startTime

	const activity = getActivity(block.activityId)

	const [hours, minutes] = gridStartTime.split(':').map(Number)

	const totalMinutesStart = hours * 60 + minutes + index * BLOCK_SIZE
	const totalMinutesEnd = totalMinutesStart + BLOCK_SIZE

	// Calculate the percentage of time elapsed in this block if isNow
	let nowLinePercent = null
	if (isNow) {
		const now = new Date()
		const nowMinutes = now.getHours() * 60 + now.getMinutes()
		const elapsed = nowMinutes - totalMinutesStart
		nowLinePercent = Math.max(0, Math.min(1, elapsed / BLOCK_SIZE))
	}

	return (
		<div
			key={index}
			title={activity?.name}
			onMouseDown={onMouseDown}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<BlockContent
				color={activity?.color || DEFAULT_BLOCK_COLOR}
				isNow={isNow}
				nowLinePercent={nowLinePercent}
			>
				{isHovered && (
					<div className="absolute inset-0 flex flex-col items-center justify-center rounded bg-black/20 font-mono text-xs font-semibold text-white">
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
			</BlockContent>
		</div>
	)
}

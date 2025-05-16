'use client'
import Block from '@/app/components/Grid/Block'
import { BLOCK_SIZE, useGlobalState, useGrid } from '@/app/components/Provider'
import { useEffect, useRef, useState } from 'react'

export default function Grid({ showNowIndicator = true }: { showNowIndicator?: boolean }) {
	const { selectedActivityId } = useGlobalState()
	const { grid, setGridState } = useGrid()

	const [hoveredBlock, setHoveredBlock] = useState<number | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const isErasing = useRef(false)

	const [nowBlockIndex, setNowBlockIndex] = useState<number | null>(null)

	useEffect(() => {
		function updateNowIndex() {
			const { startTime, blocks } = grid.state
			if (!startTime) {
				setNowBlockIndex(null)
				return
			}
			const [startHour, startMinute] = startTime.split(':').map(Number)
			const now = new Date()
			const nowMinutes = now.getHours() * 60 + now.getMinutes()
			const gridStartMinutes = startHour * 60 + startMinute
			const diff = nowMinutes - gridStartMinutes
			const idx = Math.floor(diff / BLOCK_SIZE)
			if (idx >= 0 && idx < blocks.length) {
				setNowBlockIndex(idx)
			} else {
				setNowBlockIndex(null)
			}
		}
		updateNowIndex()
		const interval = setInterval(updateNowIndex, 15 * 1000)
		return () => clearInterval(interval)
	}, [grid.state])

	const updateBlock = (index: number) => {
		const activityId = !isErasing.current ? selectedActivityId : null
		setGridState(prev => ({
			...prev,
			blocks: prev.blocks.map((block, i) => (i === index ? { ...block, activityId } : block))
		}))
	}

	const handleBlockMouseDown = (index: number) => {
		setIsDragging(true)
		isErasing.current = selectedActivityId === grid.state.blocks[index].activityId
		updateBlock(index)
	}

	const handleBlockMouseEnter = (index: number) => {
		setHoveredBlock(index)
		if (isDragging) {
			updateBlock(index)
		}
	}

	const handleMouseUp = () => setIsDragging(false)

	useEffect(() => {
		if (isDragging) {
			window.addEventListener('mouseup', handleMouseUp)
			return () => window.removeEventListener('mouseup', handleMouseUp)
		}
	}, [isDragging])

	return (
		<div className="grid grid-cols-10 gap-1 overflow-visible rounded-lg p-0 select-none">
			{grid.state.blocks.map((block, index) => {
				const isNow = showNowIndicator && nowBlockIndex === index
				return (
					<Block
						key={index}
						index={index}
						block={block}
						isHovered={hoveredBlock === index}
						isNow={isNow}
						onMouseDown={() => handleBlockMouseDown(index)}
						onMouseEnter={() => handleBlockMouseEnter(index)}
						onMouseLeave={() => setHoveredBlock(null)}
					/>
				)
			})}
		</div>
	)
}

import Block from '@/app/components/Block'
import { useGlobalState } from '@/app/components/Provider'
import { useEffect, useRef, useState } from 'react'

function getTimeString(minutes: number) {
	const h = Math.floor(minutes / 60) % 24
	const m = minutes % 60
	return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export default function BlocksGrid() {
	const { state, setState, selectedActivity } = useGlobalState()
	const [hoveredBlock, setHoveredBlock] = useState<number | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const isErasing = useRef(false)

	// Update the blocks when the start time changes
	useEffect(() => {
		const [hours, minutes] = state.startTime.split(':').map(Number)
		setState(prev => ({
			...prev,
			blocks: prev.blocks.map((_, i) => {
				const totalMinutesStart = hours * 60 + minutes + i * 10
				const totalMinutesEnd = totalMinutesStart + 10
				return {
					activityId: prev.blocks[i].activityId,
					startTime: getTimeString(totalMinutesStart),
					endTime: getTimeString(totalMinutesEnd)
				}
			})
		}))
	}, [state.startTime, setState])

	const updateBlock = (index: number) => {
		const activityId = !isErasing.current ? selectedActivity : null
		setState(prev => ({
			...prev,
			blocks: prev.blocks.map((block, i) => (i === index ? { ...block, activityId } : block))
		}))
	}

	const handleBlockMouseDown = (index: number) => {
		setIsDragging(true)
		isErasing.current = selectedActivity === state.blocks[index].activityId
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
		<div className="grid grid-cols-10 gap-1 p-0 rounded-lg select-none">
			{state.blocks.map((block, index) => {
				return (
					<Block
						block={block}
						isHovered={hoveredBlock === index}
						index={index}
						onMouseDown={() => handleBlockMouseDown(index)}
						onMouseEnter={() => handleBlockMouseEnter(index)}
						onMouseLeave={() => setHoveredBlock(null)}
					/>
				)
			})}
		</div>
	)
}

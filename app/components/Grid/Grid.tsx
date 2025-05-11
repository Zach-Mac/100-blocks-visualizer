'use client'
import Block from '@/app/components/Grid/Block'
import { useGlobalState, useGrid } from '@/app/components/Provider'
import { useEffect, useRef, useState } from 'react'

export default function Grid() {
	const { selectedActivityId } = useGlobalState()

	const { grid, setGridState } = useGrid()

	const [hoveredBlock, setHoveredBlock] = useState<number | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const isErasing = useRef(false)

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
		<div className="grid grid-cols-10 gap-1 rounded-lg p-0 select-none">
			{grid.state.blocks.map((block, index) => {
				return (
					<Block
						key={index}
						index={index}
						block={block}
						isHovered={hoveredBlock === index}
						onMouseDown={() => handleBlockMouseDown(index)}
						onMouseEnter={() => handleBlockMouseEnter(index)}
						onMouseLeave={() => setHoveredBlock(null)}
					/>
				)
			})}
		</div>
	)
}

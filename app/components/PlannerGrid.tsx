'use client'
import { useState, useRef, useEffect } from 'react'
import { FaRegClock, FaTrash } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { usePlanner } from '@/app/components/PlannerProvider'
import ConfirmModal from '@/app/components/ConfirmModal'
import { scaledVariants } from '@/app/motion'

function getTimeString(minutes: number) {
	const h = Math.floor(minutes / 60) % 24
	const m = minutes % 60
	return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export default function PlannerGrid() {
	const { state, setState, selectedActivity } = usePlanner()
	const [hoveredBlock, setHoveredBlock] = useState<number | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const isErasing = useRef(false)

	const [clearGridModal, setClearGridModal] = useState(false)

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

	const handleClearGrid = () => setClearGridModal(true)
	const confirmClearGrid = () => {
		setState(prev => ({
			...prev,
			blocks: prev.blocks.map(b => ({ ...b, activityId: null }))
		}))
		setClearGridModal(false)
	}
	const cancelClearGrid = () => setClearGridModal(false)

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
		<>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2 bg-white/80 rounded-lg border-gray-200">
					<FaRegClock className="text-gray-400 text-lg" />
					<label
						className="block text-sm font-semibold text-gray-700 mb-0"
						htmlFor="wake-up-time"
					>
						Wake up at:
					</label>
					<input
						id="wake-up-time"
						type="time"
						value={state.startTime}
						onChange={e =>
							setState(prev => ({
								...prev,
								startTime: e.target.value
							}))
						}
						className="w-28 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
					/>
				</div>
				<button
					className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-150 active:scale-95 cursor-pointer"
					onClick={handleClearGrid}
				>
					<FaTrash />
					Clear grid
				</button>
			</div>
			<div className="grid grid-cols-10 gap-1 p-0 rounded-lg select-none">
				{state.blocks.map((block, index) => {
					const activity = state.activities.find(a => a.id === block.activityId)
					const isHovered = hoveredBlock === index
					return (
						<div
							key={index}
							className="relative aspect-square rounded cursor-pointer transition-opacity group flex items-center justify-center overflow-hidden"
							style={{
								backgroundColor: activity?.color || '#f0f0f0'
							}}
							onMouseDown={() => handleBlockMouseDown(index)}
							onMouseEnter={() => handleBlockMouseEnter(index)}
							onMouseLeave={() => setHoveredBlock(null)}
						>
							{isHovered && (
								<motion.div
									variants={scaledVariants}
									initial="hidden"
									animate="visible"
									exit="hidden"
									transition={{ duration: 0.2 }}
									className="absolute inset-0 flex flex-col items-center justify-center font-mono bg-black/30 text-white text-xs font-semibold"
								>
									<div className="flex items-center">
										<span>{block.startTime}</span>
										<span>-</span>
									</div>
									<div className="flex items-center">
										<span>{block.endTime}</span>
										<span className="opacity-0">-</span>
									</div>
								</motion.div>
							)}
						</div>
					)
				})}
			</div>
			<ConfirmModal
				open={clearGridModal}
				title="Clear Grid"
				message="Are you sure you want to clear all activities from the grid?"
				confimText="Clear"
				onConfirm={confirmClearGrid}
				onCancel={cancelClearGrid}
			/>
		</>
	)
}

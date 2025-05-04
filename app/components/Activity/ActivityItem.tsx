'use client'
import React from 'react'
import { motion } from 'motion/react'
import { FaTrash } from 'react-icons/fa'
import ReactColorfulInput from '@/app/components/ReactColorfulInput'
import { useGlobalState } from '@/app/components/Provider'
import { Activity } from '@/app/types'

function lightenHSL(hsl: string, amount: number) {
	const match = hsl.match(/^hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)$/)
	if (!match) return hsl
	const [, h, s, l] = match
	const newL = Math.min(100, Math.round(Number(l) + (100 - Number(l)) * amount))
	return `hsl(${h}, ${s}%, ${newL}%)`
}

export default function ActivityItem({
	activity,
	onDelete
}: {
	activity: Activity
	onDelete: () => void
}) {
	const { selectedActivityId, setSelectedActivityId, setActivityColor } = useGlobalState()

	// const minutes = React.useMemo(() => {
	// 	const blockCount = state.blocks.filter(b => b.activityId === activity.id).length
	// 	return blockCount * 10
	// }, [state.blocks, activity.id])
	// TODO: temp
	const minutes = 0

	const handleClick = () => {
		if (selectedActivityId === activity.id) {
			setSelectedActivityId(null)
		} else {
			setSelectedActivityId(activity.id)
		}
	}

	const mildBg = selectedActivityId === activity.id ? lightenHSL(activity.color, 0.9) : undefined

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.95, y: 20 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.9, y: 30, transition: { duration: 0.2 } }}
			transition={{ type: 'spring', stiffness: 600, damping: 30 }}
		>
			<motion.div
				className={`flex items-center p-2 pr-0 rounded-lg transition-all duration-200 group cursor-pointer border-2 bg-white relative ${
					selectedActivityId !== activity.id
						? 'hover:bg-gray-50 border-transparent'
						: ' border-purple-600'
				}`}
				style={{
					...(selectedActivityId === activity.id
						? { backgroundColor: mildBg }
						: undefined)
				}}
				onClick={handleClick}
			>
				<ReactColorfulInput
					color={activity.color}
					onChange={color => setActivityColor(activity.id, color)}
				/>
				<span className="flex-1 text-sm">{activity.name}</span>
				<span className="text-xs text-gray-500 mr-2">
					{Math.floor(minutes / 60)}h {minutes % 60}m
				</span>
				<button
					onClick={e => {
						e.stopPropagation()
						onDelete()
					}}
					className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
				>
					<FaTrash />
				</button>
			</motion.div>
		</motion.div>
	)
}

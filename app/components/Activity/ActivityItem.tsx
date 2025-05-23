'use client'
import React, { useMemo } from 'react'
import { motion } from 'motion/react'
import { FaTrash } from 'react-icons/fa'
import ReactColorfulInput from '@/app/components/ReactColorfulInput'
import { useGlobalState } from '@/app/components/Provider'
import { Activity } from '@/app/types'
import clsx from 'clsx'
import Color from 'color'

function printMinutes(minutes: number | null, noSpace = false) {
	if (minutes === null) return ''
	const h = Math.floor(minutes / 60)
	const m = (minutes % 60).toString().padStart(2, '0')

	const pad = noSpace ? '' : ' '

	return `${h}h${pad}${m}m`
}

const itemVariants = {
	initial: { opacity: 0, scale: 0.1, y: -70 },
	animate: { opacity: 1, scale: 1, y: 0 },
	exit: { opacity: 0, scale: 0.1 }
}

export default function ActivityItem({
	activity,
	onDelete
}: {
	activity: Activity
	onDelete: () => void
}) {
	const {
		selectedActivityId,
		setSelectedActivityId,
		setActivityColor,
		getActivityMinutes,
		showSecondGrid,
		sidebarCollapsed
	} = useGlobalState()

	const minutes = useMemo(
		() => getActivityMinutes(activity.id),
		[activity.id, getActivityMinutes]
	)

	const handleClick = () => {
		if (selectedActivityId === activity.id) {
			setSelectedActivityId(null)
		} else {
			setSelectedActivityId(activity.id)
		}
	}

	const mildBg =
		selectedActivityId === activity.id
			? Color(activity.color).lighten(0.9).hsl().string()
			: undefined

	const getItemClasses = (activityId: string) =>
		clsx(
			'flex items-center group p-2 pr-0 rounded-lg border-2 bg-white transition-all duration-200 cursor-pointer',
			selectedActivityId === activityId
				? 'border-purple-600'
				: 'border-transparent hover:bg-gray-50'
		)

	return (
		<motion.div layout variants={itemVariants} initial="initial" animate="animate" exit="exit">
			<motion.div
				onClick={handleClick}
				className={getItemClasses(activity.id)}
				style={selectedActivityId === activity.id ? { backgroundColor: mildBg } : undefined}
				title={activity.name}
				aria-label={activity.name}
			>
				{/* 1. color picker never shrinks */}
				{!sidebarCollapsed && (
					<div className="flex-shrink-0">
						<ReactColorfulInput
							color={activity.color}
							onChange={c => setActivityColor(activity.id, c)}
						/>
					</div>
				)}
				{sidebarCollapsed && (
					<div
						className="mr-1 h-3 w-3 cursor-pointer rounded-lg border border-gray-300"
						style={{ backgroundColor: activity.color }}
					/>
				)}

				{/* 2. name fills available space and truncates */}
				<span className="flex-1 truncate text-sm">{activity.name}</span>

				{/* 3. fixed-width, monospace time cells */}
				{!sidebarCollapsed && (
					<>
						<span
							className="mr-1 flex-shrink-1 text-right font-mono text-xs text-gray-500"
							title="Left grid duration"
						>
							{printMinutes(minutes[0], showSecondGrid)}
						</span>
						{showSecondGrid && (
							<span
								className="flex-shrink-1 text-right font-mono text-xs text-gray-500"
								title="Right grid duration"
							>
								{printMinutes(minutes[1], showSecondGrid)}
							</span>
						)}
					</>
				)}

				{/* 4. delete button never shrinks */}
				{!sidebarCollapsed && (
					<button
						onClick={e => {
							e.stopPropagation()
							onDelete()
						}}
						className={clsx(
							'group-hover-always:opacity-100 flex-shrink-0 cursor-pointer py-2 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500',
							showSecondGrid ? 'px-2' : 'px-4'
						)}
						title="Delete activity"
						aria-label="Delete activity"
					>
						<FaTrash />
					</button>
				)}
			</motion.div>
		</motion.div>
	)
}

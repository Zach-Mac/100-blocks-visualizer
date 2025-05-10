'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { FaTrash } from 'react-icons/fa'
import ReactColorfulInput from '@/app/components/ReactColorfulInput'
import { useGlobalState } from '@/app/components/Provider'
import { Activity } from '@/app/types'
import clsx from 'clsx'

function lightenHSL(hsl: string, amount: number) {
	const match = hsl.match(/^hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)$/)
	if (!match) return hsl
	const [, h, s, l] = match
	const newL = Math.min(100, Math.round(Number(l) + (100 - Number(l)) * amount))
	return `hsl(${h}, ${s}%, ${newL}%)`
}

function printMinutes(minutes: number | null) {
	if (minutes === null) return ''
	const h = Math.floor(minutes / 60)
	const m = minutes % 60
	return `${h}h ${m.toString().padStart(2, '0')}m`
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
		showSecondGrid
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

	const mildBg = selectedActivityId === activity.id ? lightenHSL(activity.color, 0.9) : undefined

	const getItemClasses = (activityId: string) =>
		clsx(
			'flex items-center group p-2 pr-0 rounded-lg border-2 bg-white transition-all duration-200 cursor-pointer',
			selectedActivityId === activityId
				? 'border-purple-600'
				: 'border-transparent hover:bg-gray-50'
		)

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.95, y: 20 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.9, y: 30, transition: { duration: 0.2 } }}
			transition={{ type: 'spring', stiffness: 600, damping: 30 }}
		>
			<motion.div
				onClick={handleClick}
				className={getItemClasses(activity.id)}
				style={selectedActivityId === activity.id ? { backgroundColor: mildBg } : undefined}
			>
				{/* 1. color picker never shrinks */}
				<div className="flex-shrink-0">
					<ReactColorfulInput
						color={activity.color}
						onChange={c => setActivityColor(activity.id, c)}
					/>
				</div>

				{/* 2. name fills available space and truncates */}
				<span className="flex-1 truncate text-sm">{activity.name}</span>

				{/* 3. fixed-width, monospace time cells */}
				<span className="flex-shrink-0 w-16 text-right font-mono text-xs text-gray-500">
					{printMinutes(minutes[0])}
				</span>
				{showSecondGrid && (
					<span className="flex-shrink-0 w-16 text-right font-mono text-xs text-gray-500">
						{printMinutes(minutes[1])}
					</span>
				)}

				{/* 4. delete button never shrinks */}
				<button
					onClick={e => {
						e.stopPropagation()
						onDelete()
					}}
					className="flex-shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 px-4 py-2 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
				>
					<FaTrash />
				</button>
			</motion.div>
		</motion.div>
	)
}

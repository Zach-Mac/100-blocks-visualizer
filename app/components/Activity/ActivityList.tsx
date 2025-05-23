'use client'
import { AnimatePresence } from 'motion/react'
import ActivityItem from '@/app/components/Activity/ActivityItem'
import { Activity } from '@/app/types'

export default function ActivityList({
	activities,
	onDelete
}: {
	activities: Activity[]
	onDelete: (id: string) => void
}) {
	return (
		<AnimatePresence>
			{activities.map(activity => (
				<ActivityItem
					key={activity.id}
					activity={activity}
					onDelete={() => onDelete(activity.id)}
				/>
			))}
		</AnimatePresence>
	)
}

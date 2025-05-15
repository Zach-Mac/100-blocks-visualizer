'use client'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { useGlobalState } from '@/app/components/Provider'
import ActivityList from '@/app/components/Activity/ActivityList'
import ConfirmModal from '@/app/components/ConfirmModal'
import React, { HTMLAttributes } from 'react'
import clsx from 'clsx'
import FooterButtons from '@/app/components/FooterButtons'

export default function ActivitiesSidebar({ ...rest }: HTMLAttributes<HTMLDivElement>) {
	const { activities, addActivity, deleteActivity, activityIsUsed, sidebarCollapsed } =
		useGlobalState()

	const [newActivity, setNewActivity] = useState('')

	const [confirmModal, setConfirmModal] = useState<{ open: boolean; activityId: string | null }>({
		open: false,
		activityId: null
	})

	function handleAddActivity() {
		addActivity(newActivity)
		setNewActivity('')
	}

	function handleDeleteActivity(id: string) {
		if (activityIsUsed(id)) {
			setConfirmModal({ open: true, activityId: id })
			return
		}
		deleteActivity(id)
	}

	const confirmDelete = () => {
		const id = confirmModal.activityId
		if (!id) return

		deleteActivity(id)
		setConfirmModal({ open: false, activityId: null })
	}

	const cancelDelete = () => {
		setConfirmModal({ open: false, activityId: null })
	}

	async function onExport() {
		await navigator.clipboard.writeText(JSON.stringify(activities, null, 2))
	}
	function onImport(importText: string) {
		const imported = JSON.parse(importText)
		imported.forEach((activity: { id: string; name: string; color: string }) => {
			addActivity(activity.name, activity.color)
		})
	}

	return (
		<>
			<div
				className={clsx('flex', sidebarCollapsed ? 'flex-col items-center' : 'flex-row')}
				{...rest}
			>
				{/* <button
					className="cursor-pointer p-2 text-center"
					onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
				>
					<FaBars className="text-gray-400" />
				</button> */}
				{!sidebarCollapsed && (
					<input
						type="text"
						value={newActivity}
						onChange={e => setNewActivity(e.target.value)}
						placeholder="New activity..."
						className="min-w-0 flex-grow rounded-l-lg border p-2"
						onKeyDown={e => e.key === 'Enter' && handleAddActivity()}
					/>
				)}
				{!sidebarCollapsed && (
					<button
						onClick={handleAddActivity}
						className="cursor-pointer rounded-r-lg bg-gradient-to-r from-blue-500 to-purple-600 p-2 px-4 text-white transition-colors hover:from-blue-600 hover:to-purple-700"
					>
						<FaPlus />
					</button>
				)}
			</div>
			<div>
				{activities.length === 0 ? (
					<div className="py-6 text-center text-gray-400">
						No activities yet. Add one above!
					</div>
				) : (
					<ActivityList activities={activities} onDelete={handleDeleteActivity} />
				)}
			</div>
			<div className="mt-auto">
				<FooterButtons onImport={onImport} onExport={onExport} entityName="activities" />
			</div>
			<ConfirmModal
				open={confirmModal.open}
				title="Delete Activity"
				message="This activity is used in at least one of your grids. Deleting it will remove it from all grids. Are you sure?"
				confimText="Delete"
				onConfirm={confirmDelete}
				onCancel={cancelDelete}
			/>
		</>
	)
}

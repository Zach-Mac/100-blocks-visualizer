'use client'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { usePlanner } from '@/app/components/PlannerProvider'
import ActivityList from '@/app/components/ActivityList'
import ConfirmModal from '@/app/components/ConfirmModal'

export default function ActivitiesSidebar() {
	const { state, addActivity, deleteActivity } = usePlanner()

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
		if (state.blocks.some(b => b.activityId === id)) {
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

	return (
		<>
			<div className="flex mb-4">
				<input
					type="text"
					value={newActivity}
					onChange={e => setNewActivity(e.target.value)}
					placeholder="New activity..."
					className="flex-grow p-2 border rounded-l-lg"
					onKeyDown={e => e.key === 'Enter' && handleAddActivity()}
				/>
				<button
					onClick={handleAddActivity}
					className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 px-4 rounded-r-lg transition-colors hover:from-blue-600 hover:to-purple-700 cursor-pointer"
				>
					<FaPlus />
				</button>
			</div>
			<div className="mb-4">
				{state.activities.length === 0 ? (
					<div className="text-gray-400 text-center py-6">
						No activities yet. Add one above!
					</div>
				) : (
					<ActivityList activities={state.activities} onDelete={handleDeleteActivity} />
				)}
			</div>
			<ConfirmModal
				open={confirmModal.open}
				title="Delete Activity"
				message="This activity is used in the planner. Delete anyway?"
				confimText="Delete"
				onConfirm={confirmDelete}
				onCancel={cancelDelete}
			/>
		</>
	)
}

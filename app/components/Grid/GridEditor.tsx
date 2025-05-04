'use client'
import { useState } from 'react'
import { FaRegClock, FaTrash } from 'react-icons/fa'
import { useGrid } from '@/app/components/Provider'
import ConfirmModal from '@/app/components/ConfirmModal'
import BlocksGrid from '@/app/components/Grid/Grid'

export default function GridEditor() {
	const { grid, setGridState } = useGrid()

	const [clearGridModal, setClearGridModal] = useState(false)

	function handleStartTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
		setGridState(prev => ({
			...prev,
			startTime: e.target.value
		}))
	}

	const handleClearGrid = () => setClearGridModal(true)

	const confirmClearGrid = () => {
		setGridState(prev => ({
			...prev,
			blocks: prev.blocks.map(b => ({ ...b, activityId: null }))
		}))
		setClearGridModal(false)
	}
	const cancelClearGrid = () => setClearGridModal(false)

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
						value={grid.state.startTime}
						onChange={handleStartTimeChange}
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
			<BlocksGrid />
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

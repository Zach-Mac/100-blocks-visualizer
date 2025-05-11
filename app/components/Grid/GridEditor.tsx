'use client'
import { useState } from 'react'
import { FaLock, FaRegClock } from 'react-icons/fa'
import { useGrid } from '@/app/components/Provider'
import ConfirmModal from '@/app/components/ConfirmModal'
import BlocksGrid from '@/app/components/Grid/Grid'
import clsx from 'clsx'

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

	const buttonClasses =
		'flex items-center gap-2 font-semibold px-4 py-2 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-150 active:scale-95 cursor-pointer bg-gray-100'

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2 rounded-lg border-gray-200 bg-white/80">
					<FaRegClock className="text-lg text-gray-400" />
					<label
						className="mb-0 block text-sm font-semibold text-gray-700"
						htmlFor="wake-up-time"
					>
						Wake up at:
					</label>
					<input
						id="wake-up-time"
						type="time"
						value={grid.state.startTime}
						onChange={handleStartTimeChange}
						className="w-28 rounded-lg border border-gray-300 p-2 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
					/>
				</div>
			</div>
			<div className="flex flex-col gap-4 rounded-lg bg-gray-100 p-1">
				<BlocksGrid />
			</div>

			{/* Footer Buttons */}
			<div className="mt-4 flex items-center justify-between">
				<div className="flex gap-2">
					<button
						className={clsx(
							buttonClasses
							// 'hover:bg-gradient-to-r from-red-500 to-pink-500 hover:text-white'
						)}
						onClick={handleClearGrid}
					>
						Clear grid
					</button>
					{/* <button className={buttonClasses}>
						<FaLock className="text-gray-400" />
					</button> */}
				</div>
			</div>
			<ConfirmModal
				open={clearGridModal}
				title="Clear Grid"
				message="Are you sure you want to clear all activities from the grid?"
				confimText="Clear"
				onConfirm={confirmClearGrid}
				onCancel={cancelClearGrid}
			/>
		</div>
	)
}

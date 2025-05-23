'use client'
import { useGrid } from '@/app/components/Provider'
import ConfirmModal from '@/app/components/ConfirmModal'
import Grid from '@/app/components/Grid/Grid'
import FooterButtons from '@/app/components/FooterButtons'
import { useState } from 'react'
import { FaRegClock } from 'react-icons/fa'
import BlockContent from '@/app/components/Grid/BlockContent'
import { useZodLocalStorage } from '@/app/hooks'
import { z } from 'zod'

export default function GridEditor() {
	const { grid, setGridState } = useGrid()
	const [clearGridModal, setClearGridModal] = useState(false)
	const [showNowIndicator, setShowNowIndicator] = useZodLocalStorage(
		'showNowIndicator',
		z.boolean(),
		true
	)

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

	// Export grid data as JSON to clipboard
	const handleExport = async () => {
		await navigator.clipboard.writeText(JSON.stringify(grid.state, null, 2))
	}

	const handleImport = (importText: string) => {
		const imported = JSON.parse(importText)
		setGridState(imported)
	}

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
				<Grid showNowIndicator={showNowIndicator} />
			</div>

			{/* Footer Buttons */}
			<div className="mt-4 flex items-center justify-between gap-2">
				<FooterButtons
					onClear={handleClearGrid}
					onImport={handleImport}
					onExport={handleExport}
					entityName="grid"
				/>

				<div className="flex w-full justify-end gap-2">
					<button
						onClick={() => setShowNowIndicator(!showNowIndicator)}
						className="btn-min btn-hover flex items-center gap-2 p-2 text-gray-600"
						aria-pressed={showNowIndicator}
						title={showNowIndicator ? 'Hide Now Indicator' : 'Show Now Indicator'}
					>
						<div className="relative h-6 w-12 overflow-hidden">
							<BlockContent isNow nowLinePercent={0.4} />
							{showNowIndicator && (
								<span
									className="pointer-events-none absolute top-0 left-0 flex h-full w-full items-center justify-center"
									aria-hidden="true"
								>
									<svg
										width="100%"
										height="100%"
										viewBox="0 0 48 24"
										className="absolute top-0 left-0"
									>
										<line
											x1="4"
											y1="22"
											x2="44"
											y2="2"
											stroke="#4a5565"
											strokeWidth="3"
											strokeLinecap="round"
											opacity="0.85"
										/>
									</svg>
								</span>
							)}
						</div>
					</button>
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

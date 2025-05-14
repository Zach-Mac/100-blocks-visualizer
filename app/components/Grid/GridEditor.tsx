'use client'
import { useState, useRef } from 'react'
import { FaCopy, FaEraser, FaPaste, FaRegClock, FaCheck } from 'react-icons/fa'
import { useGrid } from '@/app/components/Provider'
import ConfirmModal from '@/app/components/ConfirmModal'
import BlocksGrid from '@/app/components/Grid/Grid'
import clsx from 'clsx'
import Modal from '@/app/components/Modal'

export default function GridEditor() {
	const { grid, setGridState } = useGrid()

	const [clearGridModal, setClearGridModal] = useState(false)
	const [importModalOpen, setImportModalOpen] = useState(false)
	const [importText, setImportText] = useState('')
	const [importError, setImportError] = useState('')
	const [exportCopied, setExportCopied] = useState(false)
	const importTextareaRef = useRef<HTMLTextAreaElement>(null)

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
		try {
			await navigator.clipboard.writeText(JSON.stringify(grid.state, null, 2))
			setExportCopied(true)
			setTimeout(() => setExportCopied(false), 1200)
		} catch (err) {
			// Optionally handle error
		}
	}

	// Open import modal
	const openImportModal = () => {
		setImportText('')
		setImportError('')
		setImportModalOpen(true)
		setTimeout(() => {
			importTextareaRef.current?.focus()
		}, 100)
	}

	// Handle import confirm
	const handleImportConfirm = () => {
		try {
			const imported = JSON.parse(importText)
			setGridState(imported)
			setImportModalOpen(false)
		} catch (err) {
			setImportError('Invalid JSON format.')
		}
	}

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
						className={clsx(buttonClasses, 'bg-red-100 text-red-700 hover:bg-red-200')}
						onClick={handleClearGrid}
						title="Clear grid"
					>
						<FaEraser className="text-red-500" />
						Clear
					</button>
					<button
						className={clsx(
							buttonClasses,
							'bg-blue-100 text-blue-700 hover:bg-blue-200'
						)}
						onClick={openImportModal}
						title="Import grid"
					>
						<FaPaste className="text-blue-500" />
						Import
					</button>
					<button
						className={clsx(
							buttonClasses,
							'bg-green-100 text-green-700 hover:bg-green-200'
						)}
						onClick={handleExport}
						title="Export grid"
					>
						{exportCopied ? (
							<FaCheck className="text-green-600" />
						) : (
							<FaCopy className="text-green-500" />
						)}
						Export
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

			{/* Import Modal */}
			<Modal open={importModalOpen} onClose={() => setImportModalOpen(false)}>
				<div className="p-7 pb-5">
					<h2 className="mb-2 text-2xl font-bold text-gray-800">Import Grid Data</h2>
					<p className="mb-3 text-gray-600">Paste your exported grid JSON below:</p>
					<textarea
						ref={importTextareaRef}
						className="min-h-[120px] w-full rounded-lg border border-gray-300 p-2 font-mono text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
						value={importText}
						onChange={e => {
							setImportText(e.target.value)
							setImportError('')
						}}
						placeholder="Paste JSON here..."
						aria-label="Paste grid JSON"
					/>
					{importError && <div className="mt-2 text-sm text-red-500">{importError}</div>}
					<div className="mt-5 flex justify-end gap-3">
						<button
							className="cursor-pointer rounded-lg bg-gray-100 px-5 py-2 font-medium text-gray-700 shadow-sm transition hover:bg-gray-200"
							onClick={() => setImportModalOpen(false)}
						>
							Cancel
						</button>
						<button
							className="cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-green-500 px-5 py-2 font-semibold text-white shadow-md transition hover:from-blue-600 hover:to-green-600"
							onClick={handleImportConfirm}
						>
							Import
						</button>
					</div>
				</div>
			</Modal>
		</div>
	)
}

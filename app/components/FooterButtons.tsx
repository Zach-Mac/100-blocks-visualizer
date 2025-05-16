import CopyButton from '@/app/components/CopyButton'
import Modal from '@/app/components/Modal'
import { useRef, useState } from 'react'
import { FaEraser, FaPaste, FaCheck, FaCopy } from 'react-icons/fa'

interface FooterButtonsProps {
	onClear?: () => void
	onImport?: (importText: string) => void
	onExport?: () => void | Promise<void>
	entityName?: string
	iconsOnly?: boolean
}

export default function FooterButtons({
	onClear,
	onImport,
	onExport,
	entityName,
	iconsOnly = false
}: FooterButtonsProps) {
	const [importModalOpen, setImportModalOpen] = useState(false)
	const [importError, setImportError] = useState('')
	const [importText, setImportText] = useState('')

	const importTextareaRef = useRef<HTMLTextAreaElement>(null)

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
			onImport?.(importText)
			setImportModalOpen(false)
		} catch (err) {
			console.error('Import error:', err)
			setImportError('Invalid JSON format.')
		}
	}

	const handleExport = async () => {
		await onExport?.()
	}

	const displayEntityName = entityName ? ' ' + entityName : ''

	return (
		<div className="mt-4 flex items-center justify-between">
			<div className="flex w-full gap-2">
				{onClear && (
					<button
						className="btn btn-red"
						onClick={onClear}
						title={`Clear${displayEntityName}`}
					>
						<FaEraser className="text-red-500" />
						{!iconsOnly && <span>Clear</span>}
					</button>
				)}
				{onImport && (
					<button
						className="btn btn-blue"
						onClick={openImportModal}
						title={`Import${displayEntityName}`}
					>
						<FaPaste className="text-blue-500" />
						{!iconsOnly && <span>Import</span>}
					</button>
				)}
				{onExport && (
					<CopyButton
						className="btn btn-green"
						onCopy={handleExport}
						title={`Export${displayEntityName}`}
					/>
				)}
			</div>
			{importError && <span className="ml-4 text-sm text-red-600">{importError}</span>}

			{/* Import Modal */}
			<Modal open={importModalOpen} onClose={() => setImportModalOpen(false)}>
				<div className="p-7 pb-5">
					<h2 className="mb-2 text-2xl font-bold text-gray-800">
						Import{displayEntityName} Data
					</h2>
					<p className="mb-3 text-gray-600">
						Paste your exported{displayEntityName} JSON below:
					</p>
					<textarea
						ref={importTextareaRef}
						className="min-h-[120px] w-full rounded-lg border border-gray-300 p-2 font-mono text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
						value={importText}
						onChange={e => {
							setImportText(e.target.value)
							setImportError('')
						}}
						placeholder={`Paste JSON here...`}
						aria-label={`Paste${displayEntityName} JSON`}
						onKeyDown={e => {
							if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
								e.preventDefault()
								handleImportConfirm()
							}
						}}
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

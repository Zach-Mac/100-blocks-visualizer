import Modal from '@/app/components/Modal'
import clsx from 'clsx'
import { useRef, useState } from 'react'
import { FaEraser, FaPaste, FaCheck, FaCopy } from 'react-icons/fa'

const buttonClasses =
	'flex items-center gap-2 font-semibold px-4 py-2 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-150 active:scale-95 cursor-pointer bg-gray-100'

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
	const [exportCopied, setExportCopied] = useState(false)
	const [exportError, setExportError] = useState<string | null>(null)
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
		setExportError(null)
		try {
			await onExport?.()
			setExportCopied(true)
			setTimeout(() => setExportCopied(false), 1200)
		} catch (err) {
			console.error('Export error:', err)
			setExportError('Failed to export. Please try again.')
		}
	}

	const displayEntityName = entityName ? ' ' + entityName : ''

	return (
		<div className="mt-4 flex items-center justify-between">
			<div className="flex w-full gap-2">
				{onClear && (
					<button
						className={clsx(buttonClasses, 'bg-red-100 text-red-700 hover:bg-red-200')}
						onClick={onClear}
						title={`Clear${displayEntityName}`}
					>
						<FaEraser className="text-red-500" />
						{!iconsOnly && <span>Clear</span>}
					</button>
				)}
				{onImport && (
					<button
						className={clsx(
							buttonClasses,
							'bg-blue-100 text-blue-700 hover:bg-blue-200'
						)}
						onClick={openImportModal}
						title={`Import${displayEntityName}`}
					>
						<FaPaste className="text-blue-500" />
						{!iconsOnly && <span>Import</span>}
					</button>
				)}
				{onExport && (
					<button
						className={clsx(
							buttonClasses,
							'bg-green-100 text-green-700 hover:bg-green-200'
						)}
						onClick={handleExport}
						title={`Export${displayEntityName}`}
					>
						{exportCopied ? (
							<FaCheck className="text-green-600" />
						) : (
							<FaCopy className="text-green-500" />
						)}
						{!iconsOnly && <span>Export</span>}
					</button>
				)}
			</div>
			{exportError && <span className="ml-4 text-sm text-red-600">{exportError}</span>}

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

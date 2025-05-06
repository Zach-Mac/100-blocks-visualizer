'use client'
import ConfirmModal from '@/app/components/ConfirmModal'
import GridEditor from '@/app/components/Grid/GridEditor'
import { defaultGridIds, GridProvider, useGlobalState } from '@/app/components/Provider'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaBars, FaPlus, FaTrash } from 'react-icons/fa'

export default function GridManager() {
	const { allGrids, addGrid, deleteGrid } = useGlobalState()
	const [selectedGridId, setSelectedGridId] = useState<string>(defaultGridIds[0])

	const [isAdding, setIsAdding] = useState(false)
	const [newGridName, setNewGridName] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	const [showDropdown, setShowDropdown] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const [deleteGridModal, setDeleteGridModal] = useState(false)

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setShowDropdown(false)
			}
		}
		if (showDropdown) {
			document.addEventListener('mousedown', handleClickOutside)
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [showDropdown])

	// Focus input when entering add mode
	useEffect(() => {
		if (isAdding && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isAdding])

	const defaultGridSelected = useMemo(
		() => defaultGridIds.includes(selectedGridId),
		[selectedGridId]
	)

	function handleAddGrid() {
		setIsAdding(true)
		setNewGridName('')
	}

	function handleCreateGrid() {
		const name = newGridName.trim() || 'New Grid'
		const newGrid = addGrid(name)
		setSelectedGridId(newGrid.id)
		setIsAdding(false)
		setNewGridName('')
	}

	function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			handleCreateGrid()
		} else if (e.key === 'Escape') {
			setIsAdding(false)
			setNewGridName('')
		}
	}

	function handleBlur() {
		if (newGridName.trim()) {
			handleCreateGrid()
		} else {
			setIsAdding(false)
			setNewGridName('')
		}
	}

	function confirmDeleteGrid() {
		if (defaultGridSelected) return

		const newGridId = deleteGrid(selectedGridId)
		setSelectedGridId(newGridId || defaultGridIds[0])

		setDeleteGridModal(false)
	}

	const tabClasses =
		'relative rounded-t-lg cursor-pointer px-4 h-6 sm:h-8 hover:z-3 hover:bg-white bg-gray-50 z-2 shadow-sm'
	const selectedTabClasses = tabClasses + ' font-semibold bg-white z-3 shadow-lg'

	const getTabClasses = useCallback(
		(gridId: string) => (selectedGridId === gridId ? selectedTabClasses : tabClasses),
		[selectedGridId]
	)

	return (
		<div className="relative">
			{/* Tabs */}
			<div className="absolute -top-0 z-2 flex w-full justify-between">
				<div className="flex">
					{allGrids.map(grid => (
						<button
							key={grid.id}
							className={getTabClasses(grid.id)}
							onClick={() => setSelectedGridId(grid.id)}
						>
							{grid.name}
						</button>
					))}
					{/* New button or input */}
					{isAdding ? (
						<input
							ref={inputRef}
							className={getTabClasses('new') + ' w-32 px-2 py-1 outline-none'}
							value={newGridName}
							onChange={e => setNewGridName(e.target.value)}
							onKeyDown={handleInputKeyDown}
							onBlur={handleBlur}
							placeholder="Grid name"
							autoFocus
						/>
					) : (
						<button
							className={getTabClasses('new')}
							onClick={handleAddGrid}
							title="Add New Grid"
						>
							<FaPlus className="font-normal" />
						</button>
					)}
				</div>
				<div className="flex">
					<div>
						<button
							className={`${selectedTabClasses} 
                        ${
							allGrids.length <= 1 || defaultGridSelected
								? 'bg-gray-400 text-gray-200 cursor-not-allowed'
								: ' text-red-500 cursor-pointer'
						}`}
							onClick={() => setDeleteGridModal(true)}
							disabled={allGrids.length <= 1 || defaultGridSelected}
						>
							<FaTrash className="font-normal" />
						</button>
					</div>
				</div>
				{/* List on far right
				<div className="relative" ref={dropdownRef}>
					<button
						className={tabClasses + ' ' + selectedTabClasses}
						onClick={() => setShowDropdown(v => !v)}
						aria-haspopup="true"
						aria-expanded={showDropdown}
					>
						<FaBars />
					</button>
					{showDropdown && (
						<div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
							{allGrids.map(grid => (
								<button
									key={grid.id}
									className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
										selectedGridId === grid.id ? 'font-semibold bg-gray-50' : ''
									}`}
									onClick={() => {
										setSelectedGridId(grid.id)
										setShowDropdown(false)
									}}
								>
									{grid.name}
								</button>
							))}
						</div>
					)}
				</div> */}
			</div>

			<div className="relative z-3 mt-6 sm:mt-7 md:mt-8 rounded-b-lg rounded-tl-none bg-white p-2 md:p-6 pt-4 shadow-lg">
				{/* <div className="bg-white rounded-lg shadow-lg p-6"> */}
				<GridProvider gridId={selectedGridId}>
					<GridEditor />
				</GridProvider>
			</div>
			<ConfirmModal
				open={deleteGridModal}
				title="Delete Grid"
				message="Are you sure you want to delete the selected grid? This cannot be undone."
				confimText="Delete"
				onConfirm={confirmDeleteGrid}
				onCancel={() => setDeleteGridModal(false)}
			/>
		</div>
	)
}

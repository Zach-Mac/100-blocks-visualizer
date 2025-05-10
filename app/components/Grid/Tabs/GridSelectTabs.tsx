import ConfirmModal from '@/app/components/ConfirmModal'
import { ContextMenu, MenuItem } from '@/app/components/ContextMenu/ContextMenu'
import useContextMenu from '@/app/components/ContextMenu/useContextMenu'
import TabButton from '@/app/components/Grid/Tabs/TabButton'
import TabButtonRenameable from '@/app/components/Grid/Tabs/TabButtonRenameable'
import useTabs from '@/app/components/Grid/Tabs/useTabs'
import { defaultGridIds, useGlobalState } from '@/app/components/Provider'
import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'

export default function GridSelectTabs({ gridManagerIndex }: { gridManagerIndex: number }) {
	const { allGrids, addGrid, deleteGrid, renameGrid, updateGridState } = useGlobalState()
	const [deleteGridModal, setDeleteGridModal] = useState('')
	const [renamingGridId, setRenamingGridId] = useState<string | null>(null)

	const { state: ctx, open, hide } = useContextMenu<string>()
	const { selectedGridId, setSelectedGridId } = useTabs(gridManagerIndex)

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'F2' && selectedGridId) {
				e.preventDefault()
				setRenamingGridId(selectedGridId)
			}
			if (
				(e.key === 'Delete' || e.key === 'Backspace') &&
				selectedGridId &&
				!defaultGridIds.includes(selectedGridId)
			) {
				e.preventDefault()
				setDeleteGridModal(selectedGridId)
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [selectedGridId])

	const handleContextMenu = (e: React.MouseEvent, gridId: string) => {
		e.preventDefault()

		if (navigator.vibrate) navigator.vibrate(10)

		open(e.clientX, e.clientY, gridId)
	}

	function confirmDeleteGrid(id: string) {
		console.log('confirmDeleteGrid', id)

		if (!id || defaultGridIds.includes(id)) return

		const newGridId = deleteGrid(id)
		setSelectedGridId(newGridId || defaultGridIds[0])
		setDeleteGridModal('')
	}

	function handleAddGrid() {
		const newGrid = addGrid('New Grid')
		setSelectedGridId(newGrid.id)
		setRenamingGridId(newGrid.id)
	}

	const contextMenuItems: MenuItem<string>[] = [
		{
			label: 'Rename',
			action: (id: string) => {
				setRenamingGridId(id)
			}
		},
		{
			label: 'Duplicate',
			action: (id: string) => {
				const original = allGrids.find(g => g.id === id)
				if (original) {
					const copy = addGrid(`${original.name} Copy`)
					updateGridState(copy.id, original.state)
				}
			}
		},
		{
			label: 'Delete',
			action: (id: string) => {
				setDeleteGridModal(id)
			},
			danger: true,
			disabled: id => defaultGridIds.includes(id)
		}
	]

	function handleSetIsRenaming(value: boolean, gridId: string) {
		if (value) setRenamingGridId(gridId)
		else if (value === false && renamingGridId === gridId) setRenamingGridId(null)
	}

	return (
		<>
			<ContextMenu<string> state={ctx} onClose={hide} items={contextMenuItems} />

			{allGrids.map(grid => (
				<TabButtonRenameable
					key={grid.id}
					selected={selectedGridId === grid.id}
					name={grid.name}
					setName={newName => renameGrid(grid.id, newName)}
					isRenaming={renamingGridId === grid.id}
					setIsRenaming={value => handleSetIsRenaming(value, grid.id)}
					onClick={() => setSelectedGridId(grid.id)}
					onContextMenu={e => handleContextMenu(e, grid.id)}
					role="tab"
					aria-selected={selectedGridId === grid.id}
					aria-controls={`tabpanel-${grid.id}`}
					id={`tab-${grid.id}`}
					tabIndex={selectedGridId === grid.id ? 0 : -1}
				/>
			))}

			<TabButton selected onClick={handleAddGrid} title="Add New Grid">
				<FaPlus className="font-normal" />
			</TabButton>

			<ConfirmModal
				open={!!deleteGridModal}
				title="Delete Grid"
				message="Are you sure you want to delete the selected grid? This cannot be undone."
				confimText="Delete"
				onConfirm={() => confirmDeleteGrid(deleteGridModal)}
				onCancel={() => setDeleteGridModal('')}
			/>
		</>
	)
}

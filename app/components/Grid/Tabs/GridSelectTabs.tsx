import ConfirmModal from '@/app/components/ConfirmModal'
import { ContextMenu, MenuItem } from '@/app/components/ContextMenu/ContextMenu'
import useContextMenu from '@/app/components/ContextMenu/useContextMenu'
import TabButton from '@/app/components/Grid/Tabs/TabButton'
import TabButtonRenameable from '@/app/components/Grid/Tabs/TabButtonRenameable'
import useTabs from '@/app/components/Grid/Tabs/useTabs'
import { defaultGridIds, useGlobalState } from '@/app/components/Provider'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'

export default function GridSelectTabs({ gridManagerIndex }: { gridManagerIndex: number }) {
	const { allGrids, addGrid, deleteGrid, renameGrid, updateGridState } = useGlobalState()
	const [deleteGridModal, setDeleteGridModal] = useState(false)
	const { state: ctx, open, hide } = useContextMenu<string>()
	const { setSelectedGridId, getTabClasses } = useTabs(gridManagerIndex)

	const [renamingTabId, setRenamingTabId] = useState<string | null>(null)

	const handleContextMenu = (e: React.MouseEvent, gridId: string) => {
		e.preventDefault()
		open(e.clientX, e.clientY, gridId)
	}

	function confirmDeleteGrid() {
		// if (defaultGridSelected) return
		// const newGridId = deleteGrid(selectedGridId)
		// setSelectedGridId(newGridId || defaultGridIds[0])
		// setDeleteGridModal(false)
	}

	function handleAddGrid() {
		const newGrid = addGrid('New Grid')
		setSelectedGridId(newGrid.id)
		setRenamingTabId(newGrid.id)
	}

	// function handleRename(id: string, newName: string) {
	// 	renameGrid(id, newName)
	// 	setRenamingTabId(null)
	// }

	const contextMenuItems: MenuItem<string>[] = [
		{
			label: 'Rename',
			action: (id: string) => {
				setRenamingTabId(id)
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
				const newId = deleteGrid(id)
				if (newId) setSelectedGridId(newId)
			},
			danger: true,
			disabled: id => defaultGridIds.includes(id)
		}
	]

	function handleSetIsRenaming(value: boolean, gridId: string) {
		if (value) setRenamingTabId(gridId)
		else if (value === false && renamingTabId === gridId) setRenamingTabId(null)
	}

	return (
		<>
			<ContextMenu<string> state={ctx} onClose={hide} items={contextMenuItems} />

			{allGrids.map(grid => (
				<TabButtonRenameable
					key={grid.id}
					name={grid.name}
					setName={newName => renameGrid(grid.id, newName)}
					isRenaming={renamingTabId === grid.id}
					setIsRenaming={value => handleSetIsRenaming(value, grid.id)}
					className={getTabClasses(grid.id)}
					onClick={() => setSelectedGridId(grid.id)}
					onContextMenu={e => handleContextMenu(e, grid.id)}
				/>
			))}

			<TabButton
				className={getTabClasses('new')}
				onClick={handleAddGrid}
				title="Add New Grid"
			>
				<FaPlus className="font-normal" />
			</TabButton>

			<ConfirmModal
				open={deleteGridModal}
				title="Delete Grid"
				message="Are you sure you want to delete the selected grid? This cannot be undone."
				confimText="Delete"
				onConfirm={confirmDeleteGrid}
				onCancel={() => setDeleteGridModal(false)}
			/>
		</>
	)
}

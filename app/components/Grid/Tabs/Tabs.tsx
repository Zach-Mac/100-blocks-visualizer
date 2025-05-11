import GridSelectTabs from '@/app/components/Grid/Tabs/GridSelectTabs'
import { getTabClasses } from '@/app/components/Grid/Tabs/useTabs'
import { useGlobalState } from '@/app/components/Provider'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { FaTimes } from 'react-icons/fa'

export default function Tabs({ gridManagerIndex }: { gridManagerIndex: number }) {
	const { setShowSecondGrid } = useGlobalState()

	const [showTabList, setShowTabList] = useState(false)
	const tabListDropdownref = useRef<HTMLDivElement>(null)

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				tabListDropdownref.current &&
				!tabListDropdownref.current.contains(event.target as Node)
			) {
				setShowTabList(false)
			}
		}
		if (showTabList) {
			document.addEventListener('mousedown', handleClickOutside)
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [showTabList])

	return (
		<div className="flex justify-between overflow-x-auto whitespace-nowrap">
			<div className="flex">
				<GridSelectTabs gridManagerIndex={gridManagerIndex} />
			</div>

			{gridManagerIndex === 1 && (
				<button
					className={clsx(getTabClasses(true), 'text-gray-500 hover:text-gray-700')}
					onClick={() => setShowSecondGrid(false)}
					title="Hide second grid"
				>
					<FaTimes className="font-normal" />
				</button>
			)}
			{/* List on far right */}
			{/* <div className="relative" ref={dropdownRef}>
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
	)
}

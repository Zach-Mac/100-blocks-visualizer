import { useGlobalState, defaultGridIds } from '@/app/components/Provider'
import { useMemo, useCallback } from 'react'

const tabClasses =
	'relative rounded-t-lg cursor-pointer px-4 h-6 sm:h-8 hover:z-3 hover:bg-white bg-gray-50 z-2 shadow-sm'
export const selectedTabClasses = tabClasses + ' font-semibold bg-white z-3 shadow-lg'

export default function useTabs(gridManagerIndex: number) {
	const { selectedGridIds, setSelectedGridIds } = useGlobalState()

	const selectedGridId = useMemo(
		() => selectedGridIds[gridManagerIndex],
		[selectedGridIds, gridManagerIndex]
	)

	const setSelectedGridId = useCallback(
		(id: string) => {
			const newIds = [...selectedGridIds]
			newIds[gridManagerIndex] = id
			setSelectedGridIds(newIds)
		},
		[selectedGridIds, setSelectedGridIds, gridManagerIndex]
	)

	const defaultGridSelected = useMemo(
		() => defaultGridIds.includes(selectedGridId),
		[selectedGridId]
	)

	const getTabClasses = (gridId: string) =>
		selectedGridId === gridId ? selectedTabClasses : tabClasses

	return {
		selectedGridId,
		setSelectedGridId,
		defaultGridSelected,
		getTabClasses
	}
}

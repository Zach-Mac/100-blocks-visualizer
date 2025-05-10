import { useGlobalState, defaultGridIds } from '@/app/components/Provider'
import clsx from 'clsx'
import { useMemo, useCallback } from 'react'

const tabClasses =
	'relative rounded-t-lg cursor-pointer px-4 h-6 sm:h-8 hover:z-3 hover:bg-white bg-gray-50 z-2 shadow-sm'
const selectedTabClasses = 'font-semibold bg-white z-3 shadow-lg'

export const getTabClasses = (selected: boolean = false) =>
	clsx(tabClasses, selected && selectedTabClasses)

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

	return {
		selectedGridId,
		setSelectedGridId,
		defaultGridSelected
	}
}

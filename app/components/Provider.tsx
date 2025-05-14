'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Activity, Block } from '@/app/types'

interface Grid {
	id: string
	name: string
	state: GridState
}

interface GridState {
	blocks: Block[]
	startTime: string
}

function useLocalStorage<T>(key: string, initialValue: T) {
	const [hydrated, setHydrated] = useState(false)
	const [value, setValue] = useState<T>(initialValue)

	useEffect(() => {
		const stored = localStorage.getItem(key)
		if (stored) setValue(JSON.parse(stored))
		setHydrated(true)
	}, [key])

	useEffect(() => {
		if (hydrated) localStorage.setItem(key, JSON.stringify(value))
	}, [key, value, hydrated])

	return [value, setValue] as const
}

const defaultGridState: GridState = {
	blocks: Array(100)
		.fill(null)
		.map(() => ({
			activityId: null,
			startTime: '',
			endTime: ''
		})),
	startTime: '08:00'
}
const defaultGrids: Grid[] = [
	{ id: 'ideal', name: 'Ideal', state: defaultGridState },
	{ id: 'actual', name: 'Actual', state: defaultGridState }
]
export const defaultGridIds = defaultGrids.map(g => g.id)

function useGlobalContextValue() {
	const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
	const [selectedGridIds, setSelectedGridIds] = useState<string[]>(defaultGridIds)
	const [showSecondGrid, setShowSecondGrid] = useState(false)
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

	const [activities, setActivities] = useLocalStorage<Activity[]>('activities', [])
	const [allGrids, setAllGrids] = useLocalStorage<Grid[]>('grids', defaultGrids)

	function addGrid(name: string): Grid {
		const id = Date.now().toString()
		setAllGrids(grids => [...grids, { id, name, state: defaultGridState } satisfies Grid])
		return { id, name, state: defaultGridState }
	}

	function renameGrid(gridId: string, newName: string): void {
		setAllGrids(grids =>
			grids.map(g => (g.id === gridId ? ({ ...g, name: newName } satisfies Grid) : g))
		)
	}

	function deleteGrid(gridId: string): string | null {
		if (defaultGridIds.includes(gridId))
			throw new Error(`Cannot delete default grid: ${gridId}`)

		// Delete grid and return the id of the previous grid in array
		const gridIndex = allGrids.findIndex(g => g.id === gridId)
		if (gridIndex === -1) throw new Error(`Grid with id ${gridId} not found`)
		const prevGridId = allGrids[gridIndex - 1]?.id || allGrids[gridIndex + 1]?.id || null
		setAllGrids(grids => grids.filter(g => g.id !== gridId))

		return prevGridId
	}

	function updateGridState(gridId: string, updater: React.SetStateAction<GridState>): void {
		setAllGrids(grids =>
			grids.map(g =>
				g.id === gridId
					? ({
							...g,
							state: typeof updater === 'function' ? updater(g.state) : updater
						} satisfies Grid)
					: g
			)
		)
	}

	function getActivity(id: string | null): Activity | undefined {
		if (!id) return undefined
		return activities.find(activity => activity.id === id)
	}

	function addActivity(name: string): void {
		if (!name.trim()) return
		const id = Date.now().toString()
		setActivities((prev: Activity[]) => [
			...prev,
			{
				id,
				name,
				color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 50%)`
			} satisfies Activity
		])
		setSelectedActivityId(id)
	}

	function deleteActivity(id: string): void {
		// Delete activity from the activities list
		setActivities(prev => prev.filter(activity => activity.id !== id))

		// Delete activity from all grids
		setAllGrids(grids =>
			grids.map(
				g =>
					({
						...g,
						state: {
							...g.state,
							blocks: g.state.blocks.map(
								b =>
									({
										...b,
										activityId: b.activityId === id ? null : b.activityId
									}) satisfies Block
							)
						}
					}) satisfies Grid
			)
		)

		// If the deleted activity is the selected one, deselect it
		if (selectedActivityId === id) setSelectedActivityId(null)
	}

	function setActivityColor(activityId: string, color: string): void {
		setActivities(prev =>
			prev.map(a => (a.id === activityId ? ({ ...a, color } satisfies Activity) : a))
		)
	}

	function activityIsUsed(id: string): boolean {
		return allGrids.some(grid => grid.state.blocks.some(block => block.activityId === id))
	}

	function getActivityMinutes(id: string): number[] {
		const minutes: number[] = [0, 0]
		for (const [index, gridId] of selectedGridIds.entries()) {
			const grid = allGrids.find(g => g.id === gridId)
			if (!grid) throw new Error(`Grid with id ${gridId} not found`)

			const blockCount = grid.state.blocks.filter(b => b.activityId === id).length
			minutes[index] = blockCount * 10
		}
		return minutes
	}

	return {
		selectedGridIds,
		setSelectedGridIds,
		showSecondGrid,
		setShowSecondGrid,

		sidebarCollapsed,
		setSidebarCollapsed,

		allGrids,
		addGrid,
		renameGrid,
		deleteGrid,
		updateGridState,

		activities,
		getActivity,
		addActivity,
		deleteActivity,
		setActivityColor,
		activityIsUsed,
		getActivityMinutes,

		selectedActivityId,
		setSelectedActivityId
	}
}

type GlobalContextType = ReturnType<typeof useGlobalContextValue>
const GlobalContext = createContext<GlobalContextType | null>(null)
export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
	const value = useGlobalContextValue()
	return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}
export function useGlobalState() {
	const ctx = useContext(GlobalContext)
	if (!ctx) throw new Error('useGlobalState must be used within GlobalStateProvider')
	return ctx
}

// --- GridWindow Context (per window) ---
function useGridWindowContextValue(gridId: string) {
	const { allGrids, updateGridState } = useGlobalState()

	const grid = allGrids.find(g => g.id === gridId)

	if (!grid) throw new Error(`Grid with id ${gridId} not found`)

	function setGridState(updater: React.SetStateAction<GridState>): void {
		updateGridState(gridId, updater)
	}

	return {
		grid,
		setGridState
	}
}

type GridWindowContextType = ReturnType<typeof useGridWindowContextValue>
const GridWindowContext = createContext<GridWindowContextType | null>(null)
export function GridProvider({ gridId, children }: { gridId: string; children: React.ReactNode }) {
	const value = useGridWindowContextValue(gridId)

	return <GridWindowContext.Provider value={value}>{children}</GridWindowContext.Provider>
}

export function useGrid() {
	const ctx = useContext(GridWindowContext)
	if (!ctx) throw new Error('useGrid must be used within GridProvider')
	return ctx
}

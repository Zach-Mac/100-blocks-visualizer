'use client'
import React, { createContext, useContext, useState } from 'react'
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
	const [value, setValue] = React.useState<T>(() => {
		if (typeof window === 'undefined') return initialValue
		const stored = localStorage.getItem(key)
		return stored ? JSON.parse(stored) : initialValue
	})
	React.useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value))
	}, [key, value])
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

function useGlobalContextValue() {
	const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)

	const [activities, setActivities] = useLocalStorage<Activity[]>('activities', [])
	const [allGrids, setAllGrids] = useLocalStorage<Grid[]>('grids', [
		{ id: 'ideal', name: 'Ideal', state: defaultGridState },
		{ id: 'actual', name: 'Actual', state: defaultGridState }
	])

	function addGrid(name: string): void {
		const id = Date.now().toString()
		setAllGrids(grids => [...grids, { id, name, state: defaultGridState } satisfies Grid])
	}

	function renameGrid(gridId: string, newName: string): void {
		setAllGrids(grids =>
			grids.map(g => (g.id === gridId ? ({ ...g, name: newName } satisfies Grid) : g))
		)
	}

	function deleteGrid(gridId: string): void {
		setAllGrids(grids => grids.filter(g => g.id !== gridId))
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
									} satisfies Block)
							)
						}
					} satisfies Grid)
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

	return {
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

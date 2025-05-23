'use client'
import React, { createContext, useContext, useState } from 'react'
import { Activity, ActivitySchema, Block } from '@/app/types'
import Color from 'color'
import { z } from 'zod'
import { useZodLocalStorage } from '@/app/hooks'

export const BLOCK_SIZE = 10 // minutes

const GridStateSchema = z.object({
	blocks: z.array(
		z.object({
			activityId: z.string().nullable(),
			startTime: z.string(),
			endTime: z.string()
		})
	),
	startTime: z.string()
})
type Grid = z.infer<typeof GridSchema>

const GridSchema = z.object({
	id: z.string(),
	name: z.string(),
	state: GridStateSchema
})
type GridState = z.infer<typeof GridStateSchema>

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
	const [selectedGridIds, setSelectedGridIds] = useZodLocalStorage<string[]>(
		'selectedGridIds',
		z.array(z.string()),
		defaultGridIds
	)
	const [showSecondGrid, setShowSecondGrid] = useZodLocalStorage<boolean>(
		'showSecondGrid',
		z.boolean(),
		false
	)
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

	const [activities, setActivities] = useZodLocalStorage<Activity[]>(
		'activities',
		z.array(ActivitySchema),
		[]
	)
	const [allGrids, setAllGrids] = useZodLocalStorage<Grid[]>(
		'grids',
		z.array(GridSchema),
		defaultGrids
	)

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

	function addActivity({ id, name, color }: { id?: string; name: string; color?: string }): void {
		if (!name.trim()) return
		const activityId = id ?? Date.now().toString()
		const activityColor = color ?? Color.hsl(Math.floor(Math.random() * 360), 80, 50).string()
		setActivities((prev: Activity[]) => [
			...prev,
			{
				id: activityId,
				name,
				color: activityColor
			} satisfies Activity
		])
		setSelectedActivityId(activityId)
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

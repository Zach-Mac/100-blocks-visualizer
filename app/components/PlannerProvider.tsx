'use client'
import React, { createContext, useContext, useState } from 'react'
import { Activity, Block } from '@/app/types'

interface PlannerState {
	activities: Activity[]
	blocks: Block[]
	startTime: string
}

interface PlannerContextType {
	state: PlannerState
	setState: React.Dispatch<React.SetStateAction<PlannerState>>
	selectedActivity: string | null
	setSelectedActivity: React.Dispatch<React.SetStateAction<string | null>>
	addActivity: (name: string) => void
	deleteActivity: (id: string) => void
}

const PlannerContext = createContext<PlannerContextType | null>(null)

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

const initialState: PlannerState = {
	activities: [],
	blocks: Array(100)
		.fill(null)
		.map((_, i) => ({
			activityId: null,
			startTime: '',
			endTime: ''
		})),
	startTime: '08:00'
}

export function usePlanner() {
	const context = useContext(PlannerContext)
	if (!context) throw new Error('usePlanner must be used within PlannerProvider')
	return context
}

export default function PlannerProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useLocalStorage<PlannerState>('plannerState', initialState)
	const [selectedActivity, setSelectedActivity] = useState<string | null>(null)

	const addActivity = (name: string) => {
		if (!name.trim()) return
		const id = Date.now().toString()
		setState(prev => ({
			...prev,
			activities: [
				...prev.activities,
				{
					id,
					name,
					color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 50%)`
				}
			]
		}))
		setSelectedActivity(id)
	}

	const deleteActivity = (id: string) => {
		setState(prev => ({
			...prev,
			activities: prev.activities.filter(a => a.id !== id),
			blocks: prev.blocks.map(b => (b.activityId === id ? { ...b, activityId: null } : b))
		}))
		if (selectedActivity === id) setSelectedActivity(null)
	}

	return (
		<PlannerContext.Provider
			value={{
				state,
				setState,
				selectedActivity,
				setSelectedActivity,
				addActivity,
				deleteActivity
			}}
		>
			{children}
		</PlannerContext.Provider>
	)
}

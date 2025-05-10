import { useState, useEffect } from 'react'

export interface ContextMenuState<T = unknown> {
	visible: boolean
	x: number
	y: number
	payload: T | null
}

export default function useContextMenu<T>() {
	const [state, setState] = useState<ContextMenuState<T>>({
		visible: false,
		x: 0,
		y: 0,
		payload: null
	})

	useEffect(() => {
		function handleClickOutside() {
			if (state.visible) {
				setState(s => ({ ...s, visible: false, payload: null }))
			}
		}
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape' && state.visible) {
				setState(s => ({ ...s, visible: false, payload: null }))
			}
		}
		document.addEventListener('click', handleClickOutside)
		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('click', handleClickOutside)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [state.visible])

	function open(x: number, y: number, payload: T) {
		setState({ visible: true, x, y, payload })
	}

	function hide() {
		setState(s => ({ ...s, visible: false, payload: null }))
	}

	return { state, open, hide }
}

import clsx from 'clsx'
import React from 'react'
import { createPortal } from 'react-dom'

export interface MenuItem<T = unknown> {
	label: string
	action: (payload: T) => void
	danger?: boolean
	disabled?: boolean | ((payload: T) => boolean)
}

interface Props<T> {
	state: { visible: boolean; x: number; y: number; payload: T | null }
	items: MenuItem<T>[]
	onClose: () => void
}

export function ContextMenu<T>({ state, items, onClose }: Props<T>) {
	if (!state.visible || state.payload == null) return null

	const menu = (
		<div
			className="absolute bg-white shadow-lg rounded-md py-1 z-50 border border-gray-200"
			style={{ top: state.y, left: state.x, position: 'fixed' }}
		>
			{items.map((item, i) => {
				const isDisabled =
					typeof item.disabled === 'function'
						? item.disabled(state.payload!)
						: item.disabled || false

				return (
					<button
						key={i}
						className={clsx(
							'block w-full text-left px-4 py-2 text-sm ',
							item.danger ? 'text-red-600' : 'text-gray-800',
							isDisabled
								? 'opacity-50 cursor-not-allowed'
								: 'hover:bg-gray-100 cursor-pointer'
						)}
						disabled={isDisabled}
						onClick={() => {
							if (isDisabled) return
							item.action(state.payload!)
							onClose()
						}}
						autoFocus={i === 0}
					>
						{item.label}
					</button>
				)
			})}
		</div>
	)

	return createPortal(menu, document.body)
}

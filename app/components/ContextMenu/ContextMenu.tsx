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
			className="absolute z-30 min-w-[180px] overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg"
			style={{ top: state.y, left: state.x, position: 'fixed' }}
		>
			{items.map((item, i) => {
				const isDisabled =
					typeof item.disabled === 'function'
						? item.disabled(state.payload!)
						: item.disabled || false

				return (
					<React.Fragment key={i}>
						{i > 0 && <div className="mx-2 border-t border-gray-100" />}
						<button
							className={clsx(
								'block w-full px-4 py-2 text-left text-sm transition-colors duration-100',
								item.danger ? 'text-red-600' : 'text-gray-800',
								isDisabled
									? 'cursor-not-allowed opacity-50'
									: 'cursor-pointer hover:bg-gray-100 focus:bg-gray-100'
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
					</React.Fragment>
				)
			})}
		</div>
	)

	return createPortal(menu, document.body)
}

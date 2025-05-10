import TabButton from '@/app/components/Grid/Tabs/TabButton'
import clsx from 'clsx'
import { useState } from 'react'

// TODO: Test if contextmenu works automatically with touch devices, if not implement

type TabButtonProps = {
	name: string
	setName: (value: string) => void
	isRenaming: boolean
	setIsRenaming: (value: boolean) => void
	// onContextMenu?: (e: React.MouseEvent | { clientX: number; clientY: number }) => void
	className?: string
} & React.ComponentPropsWithoutRef<'button'>

export default function TabButtonRenameable({
	name,
	setName,
	isRenaming,
	setIsRenaming,
	// onContextMenu,
	className,
	...rest
}: TabButtonProps) {
	const [newName, setNewName] = useState(name)
	// const touchTimeout = useRef<NodeJS.Timeout | null>(null)

	// function handleTouchStart(e: React.TouchEvent) {
	// 	// Get touch position for context menu
	// 	const touch = e.touches[0]
	// 	touchTimeout.current = setTimeout(() => {
	// 		if (onContextMenu) {
	// 			onContextMenu({ clientX: touch.clientX, clientY: touch.clientY })
	// 		}
	// 	}, 500) // 500ms for long press
	// }

	// function clearTouchTimeout() {
	// 	if (touchTimeout.current) {
	// 		clearTimeout(touchTimeout.current)
	// 		touchTimeout.current = null
	// 	}
	// }

	function handleSubmit() {
		setName(newName)
		setIsRenaming(false)
	}

	function handleCancel() {
		setNewName(name)
		setIsRenaming(false)
	}

	if (isRenaming) {
		return (
			<input
				className={clsx(className, 'w-32 px-2 py-1 outline-none cursor-text')}
				value={newName}
				onChange={e => setNewName(e.target.value)}
				onKeyDown={e => {
					if (e.key === 'Enter') handleSubmit()
					if (e.key === 'Escape') handleCancel()
				}}
				onBlur={handleSubmit}
				placeholder="Grid name"
				autoFocus
			/>
		)
	}

	return (
		<TabButton
			className={clsx(className)}
			onDoubleClick={() => setIsRenaming(true)}
			// onTouchStart={handleTouchStart}
			// onTouchEnd={clearTouchTimeout}
			// onTouchCancel={clearTouchTimeout}
			{...rest}
		>
			{name}
		</TabButton>
	)
}

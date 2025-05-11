import TabButton from '@/app/components/Grid/Tabs/TabButton'
import { getTabClasses } from '@/app/components/Grid/Tabs/useTabs'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

type TabButtonProps = {
	name: string
	setName: (value: string) => void
	isRenaming: boolean
	setIsRenaming: (value: boolean) => void
	selected: boolean
} & React.ComponentPropsWithoutRef<'button'>

export default function TabButtonRenameable({
	name,
	setName,
	isRenaming,
	setIsRenaming,
	selected,
	...rest
}: TabButtonProps) {
	const [newName, setNewName] = useState(name)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (isRenaming && inputRef.current) {
			inputRef.current.focus()
			inputRef.current.select()
		}
	}, [isRenaming])

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
				ref={inputRef}
				className={clsx(getTabClasses(selected), 'w-32 cursor-text px-2 py-1 outline-none')}
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
		<TabButton selected={selected} onDoubleClick={() => setIsRenaming(true)} {...rest}>
			{name}
		</TabButton>
	)
}

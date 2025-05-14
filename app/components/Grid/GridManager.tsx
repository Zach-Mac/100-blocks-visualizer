'use client'
import GridEditor from '@/app/components/Grid/GridEditor'
import useTabs from '@/app/components/Grid/Tabs/useTabs'
import Tabs from '@/app/components/Grid/Tabs/Tabs'
import { GridProvider } from '@/app/components/Provider'
import clsx from 'clsx'

interface Props {
	index: number
}
export default function GridManager({ index }: Props) {
	const { selectedGridId } = useTabs(index)

	const sectionClasses = clsx(
		'flex-1 overflow-auto bg-white rounded-lg rounded-tl-none p-4 shadow-lg',
		index !== 0 && 'rounded-tr-none'
	)

	return (
		<div className="z-10 flex h-full w-full flex-1 flex-col">
			<header className="top-0 z-20">
				<Tabs gridManagerIndex={index} />
			</header>

			<section className={sectionClasses}>
				<GridProvider gridId={selectedGridId}>
					<GridEditor />
				</GridProvider>
			</section>
		</div>
	)
}

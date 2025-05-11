'use client'
import clsx from 'clsx'
import HeaderInstructions from '@/app/components/HeaderInstructions'
import { useGlobalState } from '@/app/components/Provider'
import Editor from '@/app/components/Editor'

export default function PlannerApp() {
	const { showSecondGrid } = useGlobalState()

	const baseWrapper = 'max-w-6xl mx-auto p-4'
	const baseGrid = 'grid grid-cols-1 gap-2 lg:gap-4'
	const row1Grid = clsx(baseGrid, 'md:grid-cols-[15rem_1fr] xl:grid-cols-[20rem_1fr]')
	const row2Wrapper = clsx(
		baseWrapper,
		'pb-64 md:pb-4',
		showSecondGrid && 'lg:max-w-[min(2000px,90vw)]'
	)
	const row2Grid = clsx(
		baseGrid,
		showSecondGrid
			? 'lg:grid-cols-[15rem_1fr_1fr] xl:grid-cols-[20rem_1fr_1fr]'
			: 'md:grid-cols-[15rem_1fr] xl:grid-cols-[20rem_1fr]'
	)

	return (
		<>
			<div className={clsx('min-h-screen', 'bg-gray-100', 'text-sm sm:text-sm md:text-base')}>
				{' '}
				{/* ROW 1 */}
				<div className={baseWrapper}>
					<div className={row1Grid}>
						<h1 className="py-4 pr-1 text-center text-3xl font-extrabold tracking-tight text-blue-500 lg:text-4xl">
							100 Blocks a Day
						</h1>
						<HeaderInstructions />
					</div>
				</div>
				{/* ROW 2 */}
				<div className={row2Wrapper}>
					<div className={row2Grid}>
						<Editor />
					</div>
				</div>
			</div>
		</>
	)
}

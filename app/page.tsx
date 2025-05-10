'use client'
import HeaderInstructions from '@/app/components/HeaderInstructions'
import { useGlobalState } from '@/app/components/Provider'
import Editor from '@/app/components/Editor'

export default function PlannerApp() {
	const { showSecondGrid } = useGlobalState()

	const singleWrapperClasses = 'max-w-6xl mx-auto p-4'
	const dualWrapperClasses = 'max-w-6xl mx-auto p-4 lg:max-w-[min(2000px,90vw)]'

	const gridClasses = 'grid grid-cols-1 gap-2 lg:gap-4 '
	const singleColumnClasses = gridClasses + 'md:grid-cols-[15rem_1fr] xl:grid-cols-[20rem_1fr]'
	const dualColumnClasses =
		gridClasses + 'lg:grid-cols-[15rem_1fr_1fr] xl:grid-cols-[20rem_1fr_1fr]'

	const row2Wrapper = showSecondGrid ? dualWrapperClasses : singleWrapperClasses
	const row2Grid = showSecondGrid ? dualColumnClasses : singleColumnClasses

	return (
		<>
			<div className="min-h-screen bg-gray-100 text-sm sm:text-sm md:text-base">
				{/* ROW 1 */}
				<div className={singleWrapperClasses}>
					<div className={singleColumnClasses}>
						<h1 className="text-3xl lg:text-4xl font-extrabold text-blue-500 tracking-tight py-4 pr-1 text-center">
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

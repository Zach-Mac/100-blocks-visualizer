'use client'
import clsx from 'clsx'
import HeaderInstructions from '@/app/components/HeaderInstructions'
import { useGlobalState } from '@/app/components/Provider'
import { AnimatePresence, motion } from 'motion/react'
import ActivitiesSidebar from '@/app/components/Activity/ActivitiesSidebar'
import GridManager from '@/app/components/Grid/GridManager'

export default function PlannerApp() {
	const { showSecondGrid, setShowSecondGrid, sidebarCollapsed } = useGlobalState()

	const colClasses = 'flex flex-col gap-4 mx-5 sm:mx-10 md:mx-30 lg:mx-5'
	const rowClasses = 'flex flex-col gap-4 pt-4 lg:flex-row'

	const sidebarClasses = clsx(
		'lg:ml-auto flex flex-col gap-4 rounded-lg bg-white shadow-lg lg:pt-8',
		sidebarCollapsed ? 'max-w-[5rem] p-1' : 'max-w-3xl lg:w-[20rem] p-4 lg:p-6 '
	)

	console.log(sidebarClasses)

	const gridClasses = 'relative max-w-3xl flex-1'
	const grid1Classes = clsx(gridClasses, !showSecondGrid && 'lg:mr-auto')
	const grid2Classes = clsx(gridClasses, showSecondGrid && 'lg:mr-auto')

	const gridManager1Variants = {
		initial: { opacity: 0, scale: 0.5 },
		animate: { opacity: 1, scale: 1 }
	}
	const gridManager2Variants = {
		initial: { opacity: 0, scale: 0.5, x: -500 },
		animate: { opacity: 1, scale: 1, x: 0 }
	}

	const buttonClasses =
		'absolute cursor-pointer border-2 border-gray-200 transition-all hover:bg-gray-200 -z-0'
	const buttonClassesXs =
		'left-1/4 -bottom-6 w-[50%] h-6 rounded-b-2xl border-t-0 hover:-bottom-12 hover:h-12'
	const buttonClassesLg =
		'top-1/2 -right-6 h-[50%] w-6 -translate-y-1/2 rounded-r-2xl border-l-0 hover:-right-12 hover:w-12 mr-auto'

	const buttonMobileClasses = clsx(buttonClasses, buttonClassesXs, 'block lg:hidden')
	const buttonDesktopClasses = clsx(buttonClasses, buttonClassesLg, 'hidden lg:block')

	return (
		<>
			<div className={clsx('min-h-screen', 'bg-gray-100', 'text-sm sm:text-sm md:text-base')}>
				<AnimatePresence mode="wait">
					<div className={colClasses}>
						<div className={clsx('mx-auto', rowClasses)}>
							<h1 className="min-w-[20rem] p-3 text-center text-3xl font-extrabold tracking-tight text-blue-500 lg:text-4xl">
								100 Blocks a Day
							</h1>
							<HeaderInstructions className="max-w-3xl" />
						</div>

						<div className={clsx(rowClasses)}>
							<motion.div className={sidebarClasses}>
								<ActivitiesSidebar />
							</motion.div>
							<motion.div
								key="first-grid"
								variants={gridManager1Variants}
								initial="initial"
								animate="animate"
								exit="initial"
								className={grid1Classes}
							>
								<GridManager index={0} />
								{!showSecondGrid && (
									<>
										<button
											onClick={() => setShowSecondGrid(true)}
											className={buttonDesktopClasses}
											title="Add another grid manager"
										>
											+
										</button>
										<button
											onClick={() => setShowSecondGrid(true)}
											className={buttonMobileClasses}
											title="Add another grid manager"
										>
											+
										</button>
									</>
								)}
							</motion.div>

							{showSecondGrid && (
								<motion.div
									key="second-grid"
									variants={gridManager2Variants}
									initial="initial"
									animate="animate"
									exit="initial"
									className={grid2Classes}
								>
									<GridManager index={1} />
								</motion.div>
							)}
						</div>
					</div>
				</AnimatePresence>
			</div>
		</>
	)
}

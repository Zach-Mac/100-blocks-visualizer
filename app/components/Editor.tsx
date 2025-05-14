import ActivitiesSidebar from '@/app/components/Activity/ActivitiesSidebar'
import GridManager from '@/app/components/Grid/GridManager'
import { useGlobalState } from '@/app/components/Provider'
import { defaultVariants } from '@/app/motion'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'motion/react'

const gridManagerVariants = {
	initial: { opacity: 0, scale: 0.5, x: -500 },
	animate: { opacity: 1, scale: 1, x: 0 }
}

const buttonClasses =
	'absolute cursor-pointer border-2 border-gray-200 transition-all hover:bg-gray-200 -z-0'
const buttonClassesXs =
	'left-1/4 -bottom-6 w-[50%] h-6 rounded-b-2xl border-t-0 hover:-bottom-12 hover:h-12'
const buttonClassesMd =
	'top-1/2 -right-6 h-[50%] w-6 -translate-y-1/2 rounded-r-2xl border-l-0 hover:-right-12 hover:w-12'

const buttonMobileClasses = clsx(buttonClasses, buttonClassesXs, 'block md:hidden')
const buttonDesktopClasses = clsx(buttonClasses, buttonClassesMd, 'hidden md:block')

export default function Editor() {
	const { showSecondGrid, setShowSecondGrid } = useGlobalState()

	return (
		<AnimatePresence>
			<div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg md:pt-8 lg:p-6">
				<ActivitiesSidebar />
			</div>
			<div className="relative flex items-stretch overflow-visible">
				<div className="relative flex-1">
					<GridManager index={0} />
				</div>
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
			</div>

			{showSecondGrid && (
				<motion.div
					key="second-grid"
					variants={gridManagerVariants}
					initial="initial"
					animate="animate"
					exit="initial"
					transition={{ duration: 0.8 }}
					className="relative flex-1"
				>
					<GridManager index={1} />
				</motion.div>
			)}
		</AnimatePresence>
	)
}

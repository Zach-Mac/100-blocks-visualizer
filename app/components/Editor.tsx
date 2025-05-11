import ActivitiesSidebar from '@/app/components/Activity/ActivitiesSidebar'
import GridManager from '@/app/components/Grid/GridManager'
import { useGlobalState } from '@/app/components/Provider'

export default function Editor() {
	const { showSecondGrid, setShowSecondGrid } = useGlobalState()

	return (
		<>
			<div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg md:pt-8 lg:p-6">
				<ActivitiesSidebar />
			</div>
			<div className="relative flex items-stretch overflow-visible">
				<div className="relative flex-1">
					<GridManager index={0} />
				</div>
				{!showSecondGrid && (
					<button
						onClick={() => setShowSecondGrid(true)}
						className="absolute top-1/2 -right-6 h-[50%] w-6 -translate-y-1/2 cursor-pointer rounded-r-2xl border-2 border-l-0 border-gray-200 transition-all hover:-right-12 hover:w-12 hover:bg-gray-200"
						title="Add another grid manager"
					>
						+
					</button>
					//     <button
					//     onClick={() => setshowSecondGrid(true)}
					//     className={clsx(
					//         // Desktop: right side, grows horizontally
					//         'sm:block rounded-r-2xl border-2 border-l-0 border-gray-200 h-[50%] cursor-pointer transition-all hover:bg-gray-200 absolute top-1/2 -translate-y-1/2 w-6 hover:w-12 -right-6 hover:-right-12',
					//         // Mobile: below, grows vertically
					//         'mt-2 mx-auto block rounded-b-2xl border-2 border-t-0 border-gray-200 w-1/2 min-w-[3rem] h-6 hover:h-12 transition-all'
					//     )}
					//     title="Add another grid manager"
					// >
					//     +
					// </button>
				)}
			</div>
			{showSecondGrid && (
				<div className="relative flex-1">
					<GridManager index={1} />
				</div>
			)}
		</>
	)
}

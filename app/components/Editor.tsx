import ActivitiesSidebar from '@/app/components/Activity/ActivitiesSidebar'
import GridManager from '@/app/components/Grid/GridManager'
import { useGlobalState } from '@/app/components/Provider'

export default function Editor() {
	const { showSecondGrid, setShowSecondGrid } = useGlobalState()

	return (
		<>
			<div className="bg-white rounded-lg shadow-lg p-4 lg:p-6 md:pt-8 flex flex-col gap-4">
				<ActivitiesSidebar />
			</div>
			<div className="flex items-stretch relative overflow-visible">
				<div className="flex-1 relative">
					<GridManager index={0} />
				</div>
				{!showSecondGrid && (
					<button
						onClick={() => setShowSecondGrid(true)}
						className="rounded-r-2xl border-2 border-l-0 border-gray-200 h-[50%] cursor-pointer transition-all hover:bg-gray-200 absolute top-1/2 -translate-y-1/2 w-6 hover:w-12 -right-6 hover:-right-12"
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
				<div className="flex-1 relative">
					<GridManager index={1} />
				</div>
			)}
		</>
	)
}

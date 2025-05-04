'use client'
import GridWindow from '@/app/components/Grid/GridEditor'
import HeaderInstructions from '@/app/components/HeaderInstructions'
import ActivitiesSidebar from '@/app/components/Activity/ActivitiesSidebar'
import { GlobalStateProvider, GridProvider } from '@/app/components/Provider'
import GridManager from '@/app/components/Grid/GridManager'

export default function PlannerApp() {
	return (
		<GlobalStateProvider>
			<div className="min-h-screen bg-gray-100 text-xs sm:text-sm md:text-base">
				<div className="max-w-5xl 2xl:max-w-6xl mx-auto p-1 sm:p-4">
					<div className="grid grid-cols-1 md:grid-cols-[20rem_1fr] gap-4">
						<div>
							<h1 className="text-3xl md:text-4xl font-extrabold text-blue-500 tracking-tight py-4 pr-1 text-center">
								100 Blocks a Day
							</h1>
						</div>
						<div>
							<HeaderInstructions />
						</div>
						<div className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4">
							<ActivitiesSidebar />
						</div>
						<div className="bg-white rounded-lg shadow-lg p-6">
							<GridManager />
						</div>
					</div>
				</div>
			</div>
		</GlobalStateProvider>
	)
}

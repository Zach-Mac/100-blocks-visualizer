import GridEditor from '@/app/components/Grid/GridEditor'
import { GridProvider } from '@/app/components/Provider'
// import { useState } from 'react'

export default function GridManager() {
	// const [selectedGridId, setSelectedGridId] = useState<string>('ideal')

	return (
		<>
			{/* <div className="flex gap-2 mb-4">
				<button
					className={`${
						selectedGridId === 'ideal'
							? 'bg-blue-500 text-white'
							: 'bg-gray-200 text-gray-800'
					} px-4 py-2 rounded-lg transition-colors`}
					onClick={() => setSelectedGridId('ideal')}
				>
					Ideal Grid
				</button>
				<button
					className={`${
						selectedGridId === 'actual'
							? 'bg-blue-500 text-white'
							: 'bg-gray-200 text-gray-800'
					} px-4 py-2 rounded-lg transition-colors`}
					onClick={() => setSelectedGridId('actual')}
				>
					Actual Grid
				</button>
			</div> */}
			{/* <GridProvider gridId={selectedGridId}> */}
			<GridProvider gridId="ideal">
				<GridEditor />
			</GridProvider>
		</>
	)
}

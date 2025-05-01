import Modal from '@/app/components/Modal'
import { useState } from 'react'
import { FaQuestionCircle } from 'react-icons/fa'

export default function HeaderInstructions() {
	const [open, setOpen] = useState(false)

	return (
		<div className="bg-white/80 shadow rounded-lg px-3 py-2 border border-gray-100 text-gray-700">
			<p className="inline-flex items-center gap-2">
				Visualize how you plan to use your 100 daily blocks (each block = 10 minutes), and
				compare that with how you actually spend them.
				<button
					className="ml-2 align-middle flex items-center justify-center w-6 h-6 rounded-full"
					aria-label="Show instructions"
					onClick={() => setOpen(true)}
					type="button"
					title="How to use"
				>
					<FaQuestionCircle
						size={25}
						className="text-blue-500 transition-transform duration-200 hover:scale-110"
					/>
				</button>
			</p>
			<p className="mt-2 text-gray-500">
				For more on the idea, read Tim Urban’s original article at{' '}
				<a
					href="https://waitbutwhy.com/2016/10/100-blocks-day.html"
					target="_blank"
					rel="noopener noreferrer"
					className="underline text-blue-600"
				>
					Wait But Why
				</a>
				.
			</p>
			<Modal
				className="max-w-sm sm:max-w-lg md:max-w-xl"
				open={open}
				onClose={() => setOpen(false)}
			>
				<div className="p-7 pb-5">
					<h2 className="text-2xl font-bold mb-2 text-gray-800">How to Use</h2>
					<ul className="text-gray-600 list-disc list-inside space-y-1 text-left mb-7">
						<li>
							<b>Add activities</b> in the sidebar.
						</li>
						<li>
							<b>Select an activity</b> to assign it to time blocks in the grid.
						</li>
						<li>
							<b>Click or drag</b> to fill blocks. No activity selected? Click/drag to
							erase.
						</li>
					</ul>
					<div className="flex justify-end">
						<button
							className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
							onClick={() => setOpen(false)}
						>
							Close
						</button>
					</div>
				</div>
			</Modal>
		</div>
	)
}

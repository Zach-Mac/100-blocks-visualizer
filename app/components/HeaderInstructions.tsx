import Modal from '@/app/components/Modal'
import { useState } from 'react'
import { FaQuestionCircle } from 'react-icons/fa'
import React, { HTMLAttributes } from 'react'
import clsx from 'clsx'

export default function HeaderInstructions({
	className = '',
	...rest
}: HTMLAttributes<HTMLDivElement>) {
	const [open, setOpen] = useState(false)

	const mergedClassName = clsx(
		'rounded-lg border border-gray-100 bg-white/80 px-3 py-2 text-gray-700 shadow',
		className
	)

	return (
		<div className={mergedClassName} {...rest}>
			<p className="inline-flex items-center gap-2">
				Visualize how you plan to use your 100 daily blocks (each block = 10 minutes), and
				compare that with how you actually spend them.
				<button
					className="ml-2 flex h-6 w-6 items-center justify-center rounded-full align-middle"
					aria-label="Help"
					onClick={() => setOpen(true)}
					type="button"
					title="How to use"
				>
					<FaQuestionCircle
						size={25}
						className="cursor-pointer text-blue-500 transition-transform duration-200 hover:scale-110"
					/>
				</button>
			</p>
			<p className="mt-2 text-gray-500">
				For more on the idea, read Tim Urban’s original article at{' '}
				<a
					href="https://waitbutwhy.com/2016/10/100-blocks-day.html"
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 underline"
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
					<h2 className="mb-2 text-2xl font-bold text-gray-800">How to Use</h2>
					<ul className="mb-7 list-inside list-disc space-y-1 text-left text-gray-600">
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
							className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700"
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

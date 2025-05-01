'use client'
import Modal from '@/app/components/Modal'
import type { FC } from 'react'

type Props = {
	open: boolean
	title: string
	message: string
	confimText: string
	onConfirm: () => void
	onCancel: () => void
}
const ConfirmModal: FC<Props> = ({ open, title, message, confimText, onConfirm, onCancel }) => (
	<Modal open={open} onClose={onCancel}>
		<div className="p-7 pb-5">
			<h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
			<p className="mb-7 text-gray-600">{message}</p>
			<div className="flex justify-end gap-3">
				<button
					className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium shadow-sm transition cursor-pointer"
					onClick={onCancel}
				>
					Cancel
				</button>
				<button
					className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold shadow-md transition cursor-pointer"
					onClick={onConfirm}
				>
					{confimText}
				</button>
			</div>
		</div>
	</Modal>
)

export default ConfirmModal

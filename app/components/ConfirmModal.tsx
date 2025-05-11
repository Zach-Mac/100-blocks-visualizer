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
			<h2 className="mb-2 text-2xl font-bold text-gray-800">{title}</h2>
			<p className="mb-7 text-gray-600">{message}</p>
			<div className="flex justify-end gap-3">
				<button
					className="cursor-pointer rounded-lg bg-gray-100 px-5 py-2 font-medium text-gray-700 shadow-sm transition hover:bg-gray-200"
					onClick={onCancel}
				>
					Cancel
				</button>
				<button
					className="cursor-pointer rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-5 py-2 font-semibold text-white shadow-md transition hover:from-red-600 hover:to-pink-600"
					onClick={onConfirm}
					autoFocus
				>
					{confimText}
				</button>
			</div>
		</div>
	</Modal>
)

export default ConfirmModal

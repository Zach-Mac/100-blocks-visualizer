'use client'
import { defaultVariants } from '@/app/motion'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, type FC, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

const modalVariants = {
	initial: { opacity: 0, scale: 0.95, y: 40 },
	animate: { opacity: 1, scale: 1, y: 0 }
}

type ModalProps = {
	open: boolean
	onClose: () => void
	children: ReactNode
	className?: string
}

const Modal: FC<ModalProps> = ({ open, onClose, children, className }) => {
	// Close on Escape
	useEffect(() => {
		if (!open) return
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [open, onClose])

	// SSR guard
	if (typeof window === 'undefined') return null

	const modalRoot = document.getElementById('modal-root') || document.body

	const modalContent = (
		<AnimatePresence>
			{open && (
				<motion.div
					variants={defaultVariants}
					initial="hidden"
					animate="visible"
					exit="hidden"
					transition={{ duration: 0.18 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
					onClick={onClose}
					aria-modal="true"
					role="dialog"
					tabIndex={-1}
				>
					<motion.div
						variants={modalVariants}
						initial="initial"
						animate="animate"
						exit="initial"
						transition={{ type: 'spring', stiffness: 400, damping: 30 }}
						className={`w-full max-w-sm overflow-hidden rounded-2xl border border-gray-100 bg-white p-0 shadow-2xl ${
							className || ''
						}`}
						onClick={e => e.stopPropagation()}
						role="document"
					>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)

	return createPortal(modalContent, modalRoot)
}
export default Modal

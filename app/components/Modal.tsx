import { defaultVariants } from '@/app/motion'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, type FC, type ReactNode } from 'react'

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
	useEffect(() => {
		if (!open) return
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [open, onClose])

	return (
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
				>
					<motion.div
						variants={modalVariants}
						initial="initial"
						animate="animate"
						exit="initial"
						transition={{ type: 'spring', stiffness: 400, damping: 30 }}
						className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm p-0 overflow-hidden border border-gray-100 ${
							className || ''
						}`}
						onClick={e => e.stopPropagation()}
					>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
export default Modal

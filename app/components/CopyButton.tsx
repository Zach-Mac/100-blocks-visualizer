import { useState } from 'react'
import clsx from 'clsx'
import { FaCopy, FaCheck } from 'react-icons/fa'

interface CopyButtonProps {
	value?: string | (() => Promise<string> | string)
	className?: string
	iconOnly?: boolean
	label?: string
	title?: string
	successLabel?: string
	iconColor?: string
	onCopy?: () => void | Promise<void>
}

export default function CopyButton({
	value,
	className = '',
	iconOnly = false,
	label = 'Copy',
	title = 'Copy to clipboard',
	successLabel = 'Copied!',
	iconColor = 'text-green-600',
	onCopy
}: CopyButtonProps) {
	const [copied, setCopied] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleCopy() {
		setError(null)
		try {
			if (value) {
				const text = typeof value === 'function' ? await value() : value
				await navigator.clipboard.writeText(text)
			}
			setCopied(true)
			if (onCopy) await onCopy()
			setTimeout(() => setCopied(false), 1200)
		} catch (err) {
			console.error('Copy error:', err)
			setError('Failed to copy. Please try again.')
		}
	}

	return (
		<div className="inline-block">
			<button
				type="button"
				title={title}
				className={clsx(className || 'btn')}
				onClick={handleCopy}
				disabled={copied}
			>
				{copied ? <FaCheck className={iconColor} /> : <FaCopy className={iconColor} />}
				{!iconOnly && <span>{copied ? successLabel : label}</span>}
			</button>
			{error && <span className="ml-2 text-sm text-red-600">{error}</span>}
		</div>
	)
}

import clsx from 'clsx'

type BlockRenderProps = {
	color?: string
	isNow?: boolean
	isHovered?: boolean
	nowLinePercent?: number | null
	children?: React.ReactNode
}
export default function BlockContent({
	color,
	isNow,
	isHovered,
	nowLinePercent = 0.5,
	children
}: BlockRenderProps) {
	return (
		<div
			className={clsx(
				'group relative flex aspect-square cursor-pointer items-center justify-center overflow-visible rounded transition-opacity'
			)}
			style={{
				backgroundColor: color
			}}
		>
			{children}

			{isNow && nowLinePercent !== null && (
				<div
					className="pointer-events-none absolute inset-0 overflow-visible"
					aria-hidden="true"
				>
					<div
						className="absolute top-0 bottom-0 w-1.5 bg-red-500"
						style={{
							left: `${nowLinePercent * 100}%`
						}}
					>
						<div className="absolute -top-1 left-1/2 flex -translate-x-1/2 flex-col items-center">
							<div className="relative flex h-4 w-4.5 items-center justify-center border-x-6 border-t-8 border-x-transparent border-t-red-500">
								{isHovered && (
									<span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-white p-1 text-[10px] leading-none font-semibold text-red-500 select-none">
										Now
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

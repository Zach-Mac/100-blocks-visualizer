import type { Metadata } from 'next'
import './globals.css'
import PlannerProvider from '@/app/components/PlannerProvider'

export const metadata: Metadata = {
	title: '100 Blocks a Day Visualizer',
	description: 'A simple tool to visualize your daily schedule'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body>
				<PlannerProvider>{children}</PlannerProvider>
			</body>
		</html>
	)
}

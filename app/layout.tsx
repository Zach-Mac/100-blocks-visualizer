import type { Metadata } from 'next'
import './globals.css'
import { GlobalStateProvider } from '@/app/components/Provider'

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
				<GlobalStateProvider>
					{children}
					<div id="modal-root" />
				</GlobalStateProvider>
			</body>
		</html>
	)
}

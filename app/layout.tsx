import type { Metadata } from 'next'
import './globals.css'
import Provider from '@/app/components/Provider'

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
				<Provider>{children}</Provider>
			</body>
		</html>
	)
}

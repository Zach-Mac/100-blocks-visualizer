import { getTabClasses } from '@/app/components/Grid/Tabs/useTabs'

type TabButtonProps = {
	selected?: boolean
	children?: React.ReactNode
} & React.ComponentPropsWithoutRef<'button'>
export default function TabButton({ selected = false, children, ...rest }: TabButtonProps) {
	return (
		<button className={getTabClasses(selected)} {...rest}>
			{children}
		</button>
	)
}

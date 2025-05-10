type TabButtonProps = {
	children?: React.ReactNode
} & React.ComponentPropsWithoutRef<'button'>

export default function TabButton({ children, ...rest }: TabButtonProps) {
	return <button {...rest}>{children}</button>
}

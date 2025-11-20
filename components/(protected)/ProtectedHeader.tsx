import { Logotype } from '@/components/ui/logotype'
import { ModeToggle } from '@/components/mode-toggle'
import { SidebarTrigger } from '../ui/sidebar'

export function ProtectedHeader() {
	return (
		<>
			<header className='flex items-center justify-between px-12 py-3.5 border-b'>
				<SidebarTrigger />
				<Logotype />
				<ModeToggle />
			</header>
		</>
	)
}

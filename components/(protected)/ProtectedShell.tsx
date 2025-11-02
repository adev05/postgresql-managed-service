import { ReactNode } from 'react'
import { ProtectedSidebar } from './ProtectedSidebar'
import { ProtectedHeader } from './ProtectedHeader'

export function ProtectedShell({ children }: { children: ReactNode }) {
	return (
		<div className='flex min-h-screen'>
			<ProtectedSidebar />
			<div className='flex-1 flex flex-col'>
				<ProtectedHeader />
				<main className='flex-1 px-12 pt-6 pb-8'>{children}</main>
			</div>
		</div>
	)
}

'use client'

import { ReactNode } from 'react'
import { ProtectedSidebar } from '@/components/(protected)/ProtectedSidebar'
import { ProtectedHeader } from '@/components/(protected)/ProtectedHeader'
import { SessionProvider } from 'next-auth/react'
import { SidebarProvider } from '@/components/ui/sidebar'

export function ProtectedShell({ children }: { children: ReactNode }) {
	return (
		<SessionProvider>
			<SidebarProvider>
				<ProtectedSidebar />
				<div className='flex-1 flex flex-col'>
					<ProtectedHeader />
					<main className='flex-1 px-12 pt-6 pb-8'>{children}</main>
				</div>
			</SidebarProvider>
		</SessionProvider>
	)
}

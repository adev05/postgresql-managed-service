'use client'

import { ReactNode } from 'react'
import { ProtectedSidebar } from '@/components/(protected)/ProtectedSidebar'
import { ProtectedHeader } from '@/components/(protected)/ProtectedHeader'
import { SessionProvider } from 'next-auth/react'
// import SessionErrorHandler from './SessionErrorHandler'

export function ProtectedShell({ children }: { children: ReactNode }) {
	return (
		<SessionProvider>
			{/* <SessionErrorHandler /> */}
			<div className='flex min-h-screen'>
				<ProtectedSidebar />
				<div className='flex-1 flex flex-col'>
					<ProtectedHeader />
					<main className='flex-1 px-12 pt-6 pb-8'>{children}</main>
				</div>
			</div>
		</SessionProvider>
	)
}

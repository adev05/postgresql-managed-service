import { ProtectedSidebar } from '@/components/(protected)/ProtectedSidebar'
import { ProtectedHeader } from '@/components/(protected)/ProtectedHeader'
import { SessionProvider } from 'next-auth/react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ReactNode } from 'react'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
	return (
		<SessionProvider>
			<SidebarProvider
				style={
					{
						'--sidebar-width': 'calc(var(--spacing) * 72)',
						'--header-height': 'calc(var(--spacing) * 12)',
					} as React.CSSProperties
				}
			>
				<ProtectedSidebar />
				<SidebarInset>
					<div className='flex-1 flex flex-col'>
						<ProtectedHeader />
						<div className='flex flex-1 flex-col'>
							<div className='@container/main flex flex-1 flex-col gap-2'>
								<div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
									{children}
								</div>
							</div>
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</SessionProvider>
	)
}

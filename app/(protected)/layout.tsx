import { ProtectedShell } from '@/components/(protected)/ProtectedShell'
import { ReactNode } from 'react'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
	return <ProtectedShell>{children}</ProtectedShell>
}

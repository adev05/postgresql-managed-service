'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

export default function SessionProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const { data: session } = useSession()

	useEffect(() => {
		// If token refresh failed, sign out the user
		if (session?.error === 'RefreshAccessTokenError') {
			console.error('[AUTH] Session expired, signing out...')
			signOut({ callbackUrl: '/' })
		}
	}, [session])

	return <>{children}</>
}

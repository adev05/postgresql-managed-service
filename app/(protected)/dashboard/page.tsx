'use client'

import { useSession } from 'next-auth/react'

export default function Dashboard() {
	const { data: session } = useSession()

	console.log({ user: session?.user })

	return <main>{session?.user?.id}</main>
}

'use client'

import { Button } from '@/components/ui/button'
import { Logotype } from '@/components/ui/logotype'
import { ModeToggle } from '@/components/mode-toggle'
import { signOut } from 'next-auth/react'

export function ProtectedHeader() {
	return (
		<header className='flex items-center justify-between px-12 py-3.5'>
			<Logotype />
			<div className='flex items-center gap-2'>
				<Button variant='secondary' onClick={() => signOut()}>
					Выйти
				</Button>
				<ModeToggle />
			</div>
		</header>
	)
}

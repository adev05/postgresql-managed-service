'use client'

import { TelegramLoginButton } from '@/components/auth/TelegramLoginButton'
import { Logotype } from '@/components/ui/logotype'
import { ModeToggle } from '@/components/mode-toggle'

export function PublicHeader() {
	return (
		<header className='w-full border-b'>
			<div className='container mx-auto flex items-center justify-between py-3 px-4'>
				<Logotype />
				<div className='flex items-center gap-2'>
					<TelegramLoginButton />
					<ModeToggle />
				</div>
			</div>
		</header>
	)
}

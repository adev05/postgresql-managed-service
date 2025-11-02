'use client'

import { TelegramLoginButton } from '@/components/auth/TelegramLoginButton'
import { Logotype } from '@/components/ui/logotype'

const Header = () => {
	return (
		<header className='w-full'>
			<div className='container mx-auto flex items-center justify-between py-3 px-4'>
				<Logotype />
				<TelegramLoginButton />
			</div>
		</header>
	)
}

export default Header

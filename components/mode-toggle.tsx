'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

export function ModeToggle() {
	const [mounted, setMounted] = useState(false)
	const { resolvedTheme, setTheme } = useTheme()

	useEffect(() => {
		requestAnimationFrame(() => setMounted(true))
	}, [])

	if (!mounted) {
		return <Button variant='secondary' size='icon'></Button>
	}

	return (
		<>
			{mounted && (
				<Button
					variant='secondary'
					size='icon'
					onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
					aria-label='Toggle theme'
				>
					{resolvedTheme === 'light' ? <SunIcon /> : <MoonIcon />}
				</Button>
			)}
		</>
	)
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Logotype } from '@/components/ui/logotype'
import { ModeToggle } from '@/components/mode-toggle'
import { signOut } from 'next-auth/react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function ProtectedHeader() {
	const [showLogoutDialog, setShowLogoutDialog] = useState(false)
	const [isLoggingOut, setIsLoggingOut] = useState(false)

	const handleLogout = async () => {
		setIsLoggingOut(true)
		await signOut({ callbackUrl: '/' })
	}

	return (
		<>
			<header className='flex items-center justify-between px-12 py-3.5 border-b'>
				<Logotype />
				<div className='flex items-center gap-2'>
					<Button variant='secondary' onClick={() => setShowLogoutDialog(true)}>
						Выйти
					</Button>
					<ModeToggle />
				</div>
			</header>

			<AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Выйти из аккаунта?</AlertDialogTitle>
						<AlertDialogDescription>
							Вы уверены, что хотите выйти? Вам потребуется снова авторизоваться
							для доступа к системе.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isLoggingOut}>
							Отмена
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleLogout} disabled={isLoggingOut}>
							{isLoggingOut ? 'Выход...' : 'Выйти'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

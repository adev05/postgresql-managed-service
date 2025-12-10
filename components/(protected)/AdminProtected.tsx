'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React from 'react'
import { Spinner } from '@/components/ui/spinner'
import { isAdminLevel } from '@/lib/permissions'

interface AdminProtectedProps {
	children: React.ReactNode
}

/**
 * Компонент для защиты админ-страниц на уровне клиента
 * Проверяет permission_level пользователя и редиректит, если доступа нет
 */
export function AdminProtected({ children }: AdminProtectedProps) {
	const { data: session, status } = useSession()

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Spinner />
			</div>
		)
	}

	if (!session || !isAdminLevel(session?.user?.permission_level)) {
		redirect('/dashboard')
	}

	return <>{children}</>
}

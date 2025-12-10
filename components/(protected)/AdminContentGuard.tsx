'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { isAdminLevel } from '@/lib/permissions'
import { Spinner } from '@/components/ui/spinner'

interface AdminContentGuardProps {
	children: React.ReactNode
}

/**
 * Компонент для защиты контента до проверки админ-статуса на клиенте
 * Предотвращает flash контента для неавторизованных пользователей
 */
export function AdminContentGuard({ children }: AdminContentGuardProps) {
	const { data: session, status } = useSession()
	const router = useRouter()

	useEffect(() => {
		// Во время загрузки не делаем ничего
		if (status === 'loading') {
			return
		}

		// Проверяем админ-статус
		const isAdmin = isAdminLevel(session?.user?.permission_level)

		// Если не админ - редиректим
		if (!session || !isAdmin) {
			router.push('/dashboard')
		}
	}, [session, status, router])

	// Показываем спиннер во время проверки
	if (status === 'loading') {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<Spinner />
			</div>
		)
	}

	// Если не админ, показываем спиннер (редирект в процессе)
	if (!isAdminLevel(session?.user?.permission_level)) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<Spinner />
			</div>
		)
	}

	return <>{children}</>
}

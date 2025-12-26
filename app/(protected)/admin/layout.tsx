import { redirect } from 'next/navigation'
import React from 'react'
import { requireAdmin } from '@/lib/auth-roles'
// import { ProtectedHeader } from '@/components/(protected)/ProtectedHeader'
// import { ProtectedSidebar } from '@/components/(protected)/ProtectedSidebar'
import { AdminContentGuard } from '@/components/(protected)/AdminContentGuard'

interface AdminLayoutProps {
	children: React.ReactNode
}

/**
 * Layout для админ-страниц
 * Проверяет доступ на уровне сервера во время рендеринга
 * + дополнительная защита на уровне клиента через AdminContentGuard
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
	// Проверяем на сервере, является ли пользователь админом
	const isAdmin = await requireAdmin()

	// Если не админ, редиректим на dashboard
	if (!isAdmin) {
		redirect('/dashboard')
	}

	return <AdminContentGuard>{children}</AdminContentGuard>
}

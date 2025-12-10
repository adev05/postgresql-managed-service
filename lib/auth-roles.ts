import { auth } from '@/auth'
import { isAdminLevel } from '@/lib/permissions'

/**
 * Проверяет, является ли пользователь админом
 */
export async function isAdmin(): Promise<boolean> {
	const session = await auth()
	return isAdminLevel(session?.user?.permission_level)
}

/**
 * Получает текущего пользователя или null
 */
export async function getCurrentUser() {
	const session = await auth()
	return session?.user || null
}

/**
 * Проверяет, является ли пользователь админом, или возвращает false
 * Используется в admin layouts
 */
export async function requireAdmin() {
	const session = await auth()
	return isAdminLevel(session?.user?.permission_level)
}

/**
 * Проверяет, имеет ли пользователь определённый permission_level
 */
export async function hasPermissionLevel(requiredLevel: number): Promise<boolean> {
	const session = await auth()
	const userPermissionLevel = session?.user?.permission_level

	if (!userPermissionLevel) return false
	return (userPermissionLevel & requiredLevel) !== 0
}


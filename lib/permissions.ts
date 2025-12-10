/**
 * Permission levels для системы
 * Используются битовые флаги для гибкости и возможности комбинирования
 */
export const PERMISSION_LEVELS = {
	USER: 1,
	ADMIN: 2048,
} as const

export type PermissionLevel = typeof PERMISSION_LEVELS[keyof typeof PERMISSION_LEVELS]

/**
 * Маппинг permission_level на роли для удобства
 */
export function permissionLevelToRole(permissionLevel?: number): string {
	switch (permissionLevel) {
		case PERMISSION_LEVELS.ADMIN:
			return 'admin'
		case PERMISSION_LEVELS.USER:
		default:
			return 'user'
	}
}

/**
 * Проверяет, имеет ли пользователь определённый permission level
 */
export function hasPermissionLevel(
	userPermissionLevel: number | undefined,
	requiredLevel: PermissionLevel
): boolean {
	if (!userPermissionLevel) return false
	// Используем битовое ИЛИ для проверки флагов (поддержка комбинирования)
	return (userPermissionLevel & requiredLevel) !== 0
}

/**
 * Проверяет, является ли пользователь админом
 */
export function isAdminLevel(permissionLevel?: number): boolean {
	return hasPermissionLevel(permissionLevel, PERMISSION_LEVELS.ADMIN)
}

/**
 * Проверяет, имеет ли пользователь хотя бы один из указанных уровней
 */
export function hasAnyPermissionLevel(
	userPermissionLevel: number | undefined,
	requiredLevels: PermissionLevel[]
): boolean {
	return requiredLevels.some(level => hasPermissionLevel(userPermissionLevel, level))
}

/**
 * Получает человекочитаемое название уровня доступа
 */
export function getPermissionLevelName(permissionLevel?: number): string {
	switch (permissionLevel) {
		case PERMISSION_LEVELS.ADMIN:
			return 'Administrator'
		case PERMISSION_LEVELS.USER:
			return 'User'
		default:
			return 'Unknown'
	}
}

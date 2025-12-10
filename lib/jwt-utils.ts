/**
 * Парсит JWT токен и извлекает payload
 */
export function parseJwt(token: string): Record<string, unknown> | null {
	try {
		const base64Url = token.split('.')[1]
		if (!base64Url) return null

		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		)

		return JSON.parse(jsonPayload)
	} catch (error) {
		console.error('[JWT] Failed to parse token:', error)
		return null
	}
}

/**
 * Извлекает permission_level из JWT токена
 */
export function getPermissionLevelFromToken(token: string): number | undefined {
	const payload = parseJwt(token)
	return payload?.permission_level as number | undefined
}

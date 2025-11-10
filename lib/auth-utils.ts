import { auth } from '@/auth'
import { redirect } from 'next/navigation'

/**
 * Получает токен из текущей сессии или редиректит на страницу логина
 */
export async function requireAuth() {
	const session = await auth()

	if (!session?.access_token) {
		redirect('/')
	}

	return {
		session,
		token: session.access_token,
	}
}

/**
 * Проверяет валидность сессии
 */
export async function getSession() {
	return await auth()
}

/**
 * Получает токен или возвращает null
 */
export async function getAuthToken(): Promise<string | null> {
	const session = await auth()
	return session?.access_token ?? null
}

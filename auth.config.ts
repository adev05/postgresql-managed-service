import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { TelegramCredentials, AuthTokens } from '@/types/auth'
import { isAdminLevel } from '@/lib/permissions'
import { getPermissionLevelFromToken } from '@/lib/jwt-utils'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
	throw new Error('API_URL is not defined in environment variables')
}

export const authConfig: NextAuthConfig = {
	providers: [
		Credentials({
			id: 'telegram',
			name: 'Telegram',
			credentials: {
				id: { type: 'number' },
				first_name: { type: 'text' },
				last_name: { type: 'text' },
				username: { type: 'text' },
				photo_url: { type: 'text' },
				auth_date: { type: 'number' },
				hash: { type: 'text' },
			},
			authorize: async credentials => {
				try {
					const res = await fetch(`${API_URL}/auth/login-telegram`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(credentials),
					})

					if (!res.ok) {
						console.error('[AUTH] Login failed:', res.status, res.statusText)
						return null
					}

					const tokens: AuthTokens = await res.json()
					const creds = credentials as unknown as TelegramCredentials

					// Извлекаем permission_level из access токена
					const permissionLevel = getPermissionLevelFromToken(
						tokens.access_token
					)

					console.log(
						'[AUTH] Login successful, permission_level:',
						permissionLevel,
						'access_token:',
						tokens.access_token
					)

					return {
						id: String(creds.id),
						first_name: creds.first_name,
						last_name: creds.last_name || '',
						username: creds.username || '',
						photo_url: creds.photo_url || '',
						access_token: tokens.access_token,
						token_type: tokens.token_type,
						expires_in: tokens.expires_in,
						refresh_token: tokens.refresh_token,
						permission_level: permissionLevel,
					}
				} catch (error) {
					console.error('[AUTH] Authorize error:', error)
					return null
				}
			},
		}),
	],
	pages: {
		signIn: '/',
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user
			const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
			const isOnClusters = nextUrl.pathname.startsWith('/clusters')
			const isOnHelp = nextUrl.pathname.startsWith('/help')
			const isOnAdmin = nextUrl.pathname.startsWith('/admin')
			const isOnRoot = nextUrl.pathname === '/'

			const isProtectedPath =
				isOnDashboard || isOnClusters || isOnHelp || isOnAdmin

			// Проверка базовой авторизации
			if (isProtectedPath && !isLoggedIn) {
				return false // Redirect to login page
			}

			// Проверка админ-доступа по permission_level
			if (isOnAdmin && !isAdminLevel(auth?.user?.permission_level)) {
				return false // Redirect to dashboard
			}

			if (isOnRoot && isLoggedIn) {
				return Response.redirect(new URL('/dashboard', nextUrl))
			}

			return true
		},
	},
}

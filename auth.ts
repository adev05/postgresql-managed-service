import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { authConfig } from '@/auth.config'

const API_URL = process.env.API_URL!

async function refreshAccessToken(token: JWT): Promise<JWT> {
	try {
		const res = await fetch(`${API_URL}/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh_token: token.refresh_token }),
		})

		if (!res.ok) {
			throw new Error(`Failed to refresh token: ${res.status}`)
		}

		const refreshed = await res.json()

		console.log('[AUTH] Token refreshed successfully')

		return {
			...token,
			access_token: refreshed.access_token,
			refresh_token: refreshed.refresh_token ?? token.refresh_token,
			expires_at: Date.now() + refreshed.expires_in * 1000,
		}
	} catch (error) {
		console.error('[AUTH] Token refresh failed:', error)

		return {
			...token,
			error: 'RefreshAccessTokenError',
		}
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	...authConfig,
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	callbacks: {
		...authConfig.callbacks,
		async jwt({ token, user }) {
			// Initial sign in
			if (user) {
				return {
					...token,
					id: user.id,
					first_name: user.first_name,
					last_name: user.last_name,
					username: user.username,
					photo_url: user.photo_url,
					access_token: user.access_token,
					token_type: user.token_type,
					expires_at: Date.now() + user.expires_in * 1000,
					refresh_token: user.refresh_token,
				}
			}

			// Return previous token if the access token has not expired yet
			if (Date.now() < (token.expires_at as number)) {
				return token
			}

			// Access token has expired, try to refresh it
			return await refreshAccessToken(token)
		},
		async session({ session, token }) {
			// Handle refresh token error
			if (token.error === 'RefreshAccessTokenError') {
				// Force user to re-login
				session.error = 'RefreshAccessTokenError'
			}

			return {
				...session,
				user: {
					id: token.id as string,
					first_name: token.first_name as string,
					last_name: token.last_name as string,
					username: token.username as string,
					photo_url: token.photo_url as string,
				},
				access_token: `${token.token_type} ${token.access_token}`,
			}
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
})

import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

async function refreshAccessToken(token: JWT) {
	console.log({ token })
	try {
		const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh_token: token.refresh_token }),
		})

		if (!res.ok) throw new Error('Failed to refresh token')

		const refreshed = await res.json()

		console.log('[AUTH] Refreshed new token:', refreshed)

		return {
			...token,
			access_token: refreshed.access_token,
			refresh_token: refreshed.refresh_token,
			expires_at: Date.now() + refreshed.expires_in * 1000,
		}
	} catch (error) {
		console.error('[AUTH] Token refresh failed:', error)
		return { ...token, error: 'RefreshAccessTokenError' }
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			id: 'credentials',
			name: 'Telegram',
			credentials: {
				id: { label: 'id', type: 'number' },
				first_name: { label: 'first_name', type: 'text' },
				last_name: { label: 'last_name', type: 'text' },
				username: { label: 'username', type: 'text' },
				photo_url: { label: 'photo_url', type: 'text' },
				auth_date: { label: 'auth_date', type: 'date' },
				hash: { label: 'hash', type: 'text' },
			},
			authorize: async credentials => {
				console.log('[AUTH] authorize() called with:', credentials)
				const res = await fetch(`${BACKEND_URL}/auth/login-telegram`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(credentials),
				})

				if (!res.ok) return null

				const { access_token, token_type, expires_in, refresh_token } =
					await res.json()

				console.log({ access_token, token_type, expires_in, refresh_token })

				const user = {
					id: String(credentials.id),
					first_name: String(credentials.first_name),
					last_name: String(credentials.last_name),
					username: String(credentials.username),
					photo_url: String(credentials.photo_url),

					access_token,
					refresh_token,
					expires_in,
				}

				console.log('[AUTH] Returning user:', user)
				return user
			},
		}),
	],
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.first_name = user.first_name
				token.last_name = user.last_name
				token.username = user.username
				token.photo_url = user.photo_url

				token.access_token = user.access_token
				token.refresh_token = user.refresh_token
				token.expires_at = Date.now() + user.expires_in * 1000
				return token
			}
			if (Date.now() < (token.expires_at as number)) {
				return token
			}

			return await refreshAccessToken(token)
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string
				session.user.first_name = token.first_name as string
				session.user.last_name = token.last_name as string
				session.user.username = token.username as string
				session.user.photo_url = token.photo_url as string
			}

			session.access_token = token.access_token as string
			return session
		},
	},
	pages: { signIn: '/' },
	secret: process.env.NEXTAUTH_SECRET,
})

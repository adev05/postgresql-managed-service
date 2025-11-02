import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			id: 'credentials',
			name: 'Telegram',
			credentials: {
				id: { label: 'id', type: 'text' },
				first_name: { label: 'first_name', type: 'text' },
				username: { label: 'username', type: 'text' },
				photo_url: { label: 'photo_url', type: 'text' },
				auth_date: { label: 'auth_date', type: 'text' },
				hash: { label: 'hash', type: 'text' },
			},
			authorize: async credentials => {
				console.log('[AUTH] authorize() called with:', credentials)

				const user = {
					id: String(credentials.id),
					// name: String(credentials.username),
					// image: String(credentials.photo_url),
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
			}
			return token
		},
		// async session({ session, token }) {
		// 	if (token) {
		// 		session.user = {
		// 			id: token.id as string,
		// 		}
		// 	}
		// 	return session
		// },
	},
	pages: { signIn: '/' },
	secret: process.env.NEXTAUTH_SECRET,
})

import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
	interface User {
		id: string
		first_name: string
		last_name: string
		username: string
		photo_url: string
		access_token: string
		token_type: string
		expires_in: number
		refresh_token: string
	}

	interface Session {
		user: {
			id: string
			first_name: string
			last_name: string
			username: string
			photo_url: string
		}
		access_token: string
		error?: string
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string
		first_name: string
		last_name: string
		username: string
		photo_url: string
		access_token: string
		token_type: string
		expires_at: number
		refresh_token: string
		error?: string
	}
}

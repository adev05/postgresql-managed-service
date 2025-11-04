import 'next-auth'

declare module 'next-auth' {
	interface User {
		id: string
		first_name: string
		last_name: string
		username: string
		photo_url: string
		access_token: string
		refresh_token: string
		expires_in: number
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
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id?: string
		first_name?: string
		last_name?: string
		username?: string
		photo_url?: string

		access_token?: string
		refresh_token?: string
		expires_at?: number
	}
}

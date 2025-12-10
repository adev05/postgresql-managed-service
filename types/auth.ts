export interface TelegramCredentials {
	id: number
	first_name: string
	last_name?: string
	username?: string
	photo_url?: string
	auth_date: number
	hash: string
}

export interface AuthTokens {
	access_token: string
	token_type: string
	expires_in: number
	refresh_token: string
	permission_level?: number // уровень доступа из токена (1 - user, 2048 - admin)
}

export interface TelegramUser {
	id: string
	first_name: string
	last_name?: string
	username?: string
	photo_url?: string
	permission_level?: number
}

/**
 * Пользователь в контексте сессии с дополнительными полями
 */
export interface UserSession {
	id: string
	telegram_id: number
	telegram_username: string | null
	telegram_first_name: string | null
	telegram_last_name: string | null
	// email: string | null
	// company_name: string | null
	created_at: string | null
	updated_at: string | null
	last_login_at: string | null
	// role: UserRole // Добавляем роль (пока не в БД, но нужна для middleware)

	// Telegram-специфичные поля для быстрого доступа
	display_name: string // Вычисляемое поле: first_name + last_name или username
	avatar_url?: string // URL аватара из Telegram (если доступен)
}

/**
 * Данные пользователя из Telegram OAuth
 */
export interface TelegramUser {
	id: number
	first_name: string
	last_name?: string
	username?: string
	photo_url?: string
	auth_date: number
	hash: string
}

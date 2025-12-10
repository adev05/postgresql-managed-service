import React from 'react'
import { getCurrentUser } from '@/lib/auth-roles'
import { TypographyH1 } from '@/components/ui/TypographyH1'
import { TypographyH2 } from '@/components/ui/TypographyH2'

export default async function AdminDashboard() {
	const user = await getCurrentUser()

	return (
		<div className='space-y-8'>
			<div>
				<TypographyH1>Админ-панель</TypographyH1>
				<p className='text-muted-foreground mt-2'>
					Добро пожаловать, {user?.first_name}! Здесь вы можете управлять
					системой.
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{/* Карточки с административными функциями */}
				<div className='border rounded-lg p-6 hover:bg-muted transition'>
					<TypographyH2>Управление пользователями</TypographyH2>
					<p className='text-sm text-muted-foreground mt-2'>
						Просмотр и управление пользователями системы
					</p>
				</div>

				<div className='border rounded-lg p-6 hover:bg-muted transition'>
					<TypographyH2>Логи системы</TypographyH2>
					<p className='text-sm text-muted-foreground mt-2'>
						Просмотр логов действий в системе
					</p>
				</div>

				<div className='border rounded-lg p-6 hover:bg-muted transition'>
					<TypographyH2>Настройки</TypographyH2>
					<p className='text-sm text-muted-foreground mt-2'>
						Конфигурация системы и параметры
					</p>
				</div>
			</div>
		</div>
	)
}

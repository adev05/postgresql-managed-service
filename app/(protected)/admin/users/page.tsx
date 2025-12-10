import React from 'react'
import { TypographyH2 } from '@/components/ui/TypographyH2'
import { Button } from '@/components/ui/button'

export default async function UsersManagementPage() {
	return (
		<div className="space-y-6">
			<div>
				<TypographyH2>Управление пользователями</TypographyH2>
				<p className="text-sm text-muted-foreground mt-2">
					Просмотр списка всех пользователей и управление их правами
				</p>
			</div>

			<div className="border rounded-lg p-6">
				<div className="flex justify-between items-center mb-4">
					<h3 className="font-semibold">Пользователи</h3>
					<Button>+ Добавить пользователя</Button>
				</div>

				<div className="text-center py-8 text-muted-foreground">
					<p>Таблица пользователей будет здесь</p>
				</div>
			</div>
		</div>
	)
}

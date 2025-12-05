'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { UserPlus, MoreVertical, Shield, Trash2, Cable } from 'lucide-react'
import { useState } from 'react'

// Моканные данные пользователей
const mockUsers = [
	{
		id: '1',
		username: 'postgres',
		role: 'superuser',
		canLogin: true,
		canCreateDB: true,
		canCreateRole: true,
		connections: 12,
		validUntil: null,
		createdAt: '2024-11-15T10:00:00Z',
	},
	{
		id: '2',
		username: 'admin',
		role: 'admin',
		canLogin: true,
		canCreateDB: true,
		canCreateRole: false,
		connections: 8,
		validUntil: null,
		createdAt: '2024-11-16T11:20:00Z',
	},
	{
		id: '3',
		username: 'app_user',
		role: 'user',
		canLogin: true,
		canCreateDB: false,
		canCreateRole: false,
		connections: 23,
		validUntil: '2025-12-31',
		createdAt: '2024-11-18T14:30:00Z',
	},
	{
		id: '4',
		username: 'readonly_user',
		role: 'readonly',
		canLogin: true,
		canCreateDB: false,
		canCreateRole: false,
		connections: 5,
		validUntil: null,
		createdAt: '2024-11-20T09:15:00Z',
	},
]

export default function UsersTab() {
	const [users] = useState(mockUsers)

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})
	}

	const getRoleBadgeVariant = (role: string) => {
		switch (role) {
			case 'superuser':
				return 'destructive'
			case 'admin':
				return 'default'
			case 'user':
				return 'secondary'
			case 'readonly':
				return 'outline'
			default:
				return 'secondary'
		}
	}

	const getRoleLabel = (role: string) => {
		const labels: Record<string, string> = {
			superuser: 'Суперпользователь',
			admin: 'Администратор',
			user: 'Пользователь',
			readonly: 'Только чтение',
		}
		return labels[role] || role
	}

	return (
		<div className='space-y-4'>
			{/* Статистика */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>Всего пользователей</CardTitle>
						<CardAction>
							<Shield className='h-4 w-4 text-muted-foreground' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{users.length}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Суперпользователи</CardTitle>
						<CardAction>
							<Shield className='h-4 w-4 text-destructive' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{users.filter(u => u.role === 'superuser').length}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Администраторы</CardTitle>
						<CardAction>
							<Shield className='h-4 w-4 text-primary' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{users.filter(u => u.role === 'admin').length}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Активных подключений</CardTitle>
						<CardAction>
							<Cable className='h-4 w-4 text-muted-foreground' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{users.reduce((sum, u) => sum + u.connections, 0)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Список пользователей */}
			<Card>
				<CardHeader>
					<CardTitle>Пользователи</CardTitle>
					<CardDescription>
						Управление пользователями и их правами доступа
					</CardDescription>
					<CardAction>
						<Button>
							<UserPlus className='w-4 h-4' />
							Создать пользователя
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Имя пользователя</TableHead>
								<TableHead>Роль</TableHead>
								<TableHead>Права</TableHead>
								<TableHead>Подключения</TableHead>
								<TableHead>Действителен до</TableHead>
								<TableHead>Создан</TableHead>
								<TableHead className='w-[50px]'></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map(user => (
								<TableRow key={user.id}>
									<TableCell className='font-medium'>{user.username}</TableCell>
									<TableCell>
										<Badge variant={getRoleBadgeVariant(user.role)}>
											{getRoleLabel(user.role)}
										</Badge>
									</TableCell>
									<TableCell>
										<div className='flex gap-1 flex-wrap'>
											{user.canLogin && (
												<Badge variant='outline' className='text-xs'>
													Login
												</Badge>
											)}
											{user.canCreateDB && (
												<Badge variant='outline' className='text-xs'>
													Create DB
												</Badge>
											)}
											{user.canCreateRole && (
												<Badge variant='outline' className='text-xs'>
													Create Role
												</Badge>
											)}
										</div>
									</TableCell>
									<TableCell>{user.connections}</TableCell>
									<TableCell className='text-muted-foreground'>
										{user.validUntil ? formatDate(user.validUntil) : '∞'}
									</TableCell>
									<TableCell className='text-muted-foreground'>
										{formatDate(user.createdAt)}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant='ghost' size='icon'>
													<MoreVertical className='w-4 h-4' />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												<DropdownMenuItem>Изменить пароль</DropdownMenuItem>
												<DropdownMenuItem>Управление правами</DropdownMenuItem>
												<DropdownMenuItem>Настройки</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem className='text-destructive'>
													<Trash2 className='w-4 h-4 mr-2' />
													Удалить
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	)
}

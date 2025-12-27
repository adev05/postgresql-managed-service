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
import { MoreVertical, Trash2, Users, Database } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useClusterStore } from '@/stores/cluster-store'
import { ClusterUser } from '@/types/cluster-user'
import { fetchClusterUsers } from '@/lib/actions/cluster-users'
import CreateClusterUserDialog from '../admin/cluster-users/CreateClusterUserDialog'
import { deleteClusterUser } from '@/actions/cluster-user'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Spinner } from '@/components/ui/spinner'

export default function UsersTab() {
	const currentCluster = useClusterStore(state => state.currentCluster)
	const [users, setUsers] = useState<ClusterUser[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const loadUsers = async () => {
		if (!currentCluster) return

		setLoading(true)
		setError(null)
		try {
			const result = await fetchClusterUsers(currentCluster.id, 100, 0)
			setUsers(result.cluster_users)
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Ошибка загрузки пользователей'
			)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadUsers()
	}, [currentCluster])

	const handleUserCreated = () => {
		loadUsers()
	}

	const handleDeleteClick = async (user: ClusterUser) => {
		if (!currentCluster) return
		if (user.status.status === 'DELETED') return

		if (
			!confirm(
				`Вы уверены, что хотите удалить пользователя "${user.username}"?`
			)
		) {
			return
		}

		try {
			await deleteClusterUser(currentCluster.id, user.id)
			await loadUsers()
		} catch (error) {
			console.error('Error deleting user:', error)
			alert(
				error instanceof Error
					? error.message
					: 'Ошибка при удалении пользователя'
			)
		}
	}

	if (!currentCluster) {
		return (
			<div className='flex items-center justify-center h-64'>
				<p className='text-muted-foreground'>Кластер не найден</p>
			</div>
		)
	}

	if (loading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<Spinner />
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>
					<p className='text-destructive mb-2'>Ошибка загрузки пользователей</p>
					<p className='text-sm text-muted-foreground'>{error}</p>
					<Button onClick={loadUsers} className='mt-4'>
						Попробовать снова
					</Button>
				</div>
			</div>
		)
	}

	const formatDate = (dateString: string) => {
		try {
			return formatDistanceToNow(new Date(dateString), {
				addSuffix: true,
				locale: ru,
			})
		} catch {
			return '-'
		}
	}

	return (
		<div className='space-y-4'>
			{/* Статистика */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>Всего пользователей</CardTitle>
						<CardAction>
							<Users className='h-4 w-4 text-muted-foreground' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{users.length}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Активных</CardTitle>
						<CardAction>
							<Database className='h-4 w-4 text-green-500' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{users.filter(u => u.status.status !== 'DELETED').length}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Удаленных</CardTitle>
						<CardAction>
							<Trash2 className='h-4 w-4 text-destructive' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{users.filter(u => u.status.status === 'DELETED').length}
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
						<CreateClusterUserDialog
							clusterId={currentCluster.id}
							onUserCreated={handleUserCreated}
						/>
					</CardAction>
				</CardHeader>
				<CardContent>
					{users.length === 0 ? (
						<div className='text-center py-8 text-muted-foreground'>
							Пользователи не найдены
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Имя пользователя</TableHead>
									<TableHead>Разрешения</TableHead>
									<TableHead>Статус</TableHead>
									<TableHead>Создан</TableHead>
									<TableHead>Обновлен</TableHead>
									<TableHead className='w-[50px]'></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map(user => {
									const isDeleted = user.status.status === 'DELETED'
									const permissions = user.permissions.split(',')

									return (
										<TableRow key={user.id}>
											<TableCell className='font-medium font-mono'>
												{user.username}
											</TableCell>
											<TableCell>
												<div className='flex gap-1 flex-wrap'>
													{permissions.map(perm => (
														<Badge
															key={perm}
															variant='outline'
															className='text-xs'
														>
															{perm}
														</Badge>
													))}
												</div>
											</TableCell>
											<TableCell>
												<Badge variant={isDeleted ? 'destructive' : 'default'}>
													{user.status.status}
												</Badge>
											</TableCell>
											<TableCell className='text-muted-foreground text-sm'>
												{formatDate(user.created_at)}
											</TableCell>
											<TableCell className='text-muted-foreground text-sm'>
												{formatDate(user.updated_at)}
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant='ghost'
															size='icon'
															disabled={isDeleted}
														>
															<MoreVertical className='w-4 h-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end'>
														<DropdownMenuItem
															className='text-destructive'
															onClick={() => handleDeleteClick(user)}
															disabled={isDeleted}
														>
															<Trash2 className='w-4 h-4 mr-2' />
															Удалить
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

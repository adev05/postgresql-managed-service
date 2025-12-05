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
import { Progress } from '@/components/ui/progress'
import {
	Save,
	MoreVertical,
	Download,
	RotateCcw,
	Trash2,
	Clock,
	HardDrive,
	CheckCircle2,
	AlertCircle,
	Loader2,
} from 'lucide-react'
import { useState } from 'react'

// Моканные данные резервных копий
const mockBackups = [
	{
		id: '1',
		name: 'Auto backup - Daily',
		type: 'automatic',
		status: 'completed',
		size: '1.2 GB',
		databases: ['production', 'staging'],
		createdAt: '2024-12-05T03:00:00Z',
		expiresAt: '2024-12-12T03:00:00Z',
		duration: '2m 34s',
	},
	{
		id: '2',
		name: 'Pre-migration backup',
		type: 'manual',
		status: 'completed',
		size: '1.8 GB',
		databases: ['production', 'staging', 'analytics'],
		createdAt: '2024-12-04T15:30:00Z',
		expiresAt: '2025-01-04T15:30:00Z',
		duration: '3m 12s',
	},
	{
		id: '3',
		name: 'Auto backup - Daily',
		type: 'automatic',
		status: 'completed',
		size: '1.1 GB',
		databases: ['production', 'staging'],
		createdAt: '2024-12-04T03:00:00Z',
		expiresAt: '2024-12-11T03:00:00Z',
		duration: '2m 28s',
	},
	{
		id: '4',
		name: 'Weekly backup',
		type: 'scheduled',
		status: 'in_progress',
		size: '0.8 GB',
		databases: ['production'],
		createdAt: '2024-12-05T10:15:00Z',
		expiresAt: null,
		duration: null,
		progress: 67,
	},
	{
		id: '5',
		name: 'Auto backup - Daily',
		type: 'automatic',
		status: 'failed',
		size: null,
		databases: ['production', 'staging'],
		createdAt: '2024-12-03T03:00:00Z',
		expiresAt: null,
		duration: null,
		error: 'Insufficient storage space',
	},
]

// Настройки автоматического бэкапа
const backupSchedule = {
	enabled: true,
	frequency: 'daily',
	time: '03:00',
	retention: 7, // дней
	lastBackup: '2024-12-05T03:00:00Z',
	nextBackup: '2024-12-06T03:00:00Z',
}

export default function BackupsTab() {
	const [backups] = useState(mockBackups)

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const formatDateShort = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'completed':
				return (
					<Badge
						variant='outline'
						className='bg-green-50 text-green-700 border-green-200'
					>
						<CheckCircle2 className='w-3 h-3 mr-1' />
						Завершён
					</Badge>
				)
			case 'in_progress':
				return (
					<Badge
						variant='outline'
						className='bg-blue-50 text-blue-700 border-blue-200'
					>
						<Loader2 className='w-3 h-3 mr-1 animate-spin' />В процессе
					</Badge>
				)
			case 'failed':
				return (
					<Badge
						variant='outline'
						className='bg-red-50 text-red-700 border-red-200'
					>
						<AlertCircle className='w-3 h-3 mr-1' />
						Ошибка
					</Badge>
				)
			default:
				return <Badge variant='secondary'>{status}</Badge>
		}
	}

	const getTypeBadge = (type: string) => {
		const labels: Record<string, string> = {
			automatic: 'Автоматический',
			manual: 'Ручной',
			scheduled: 'По расписанию',
		}
		return <Badge variant='secondary'>{labels[type] || type}</Badge>
	}

	const totalBackups = backups.length
	const completedBackups = backups.filter(b => b.status === 'completed').length
	const totalSize = backups
		.filter(b => b.size)
		.reduce((sum, b) => {
			const size = parseFloat(b.size!.split(' ')[0])
			return sum + size
		}, 0)

	return (
		<div className='space-y-4'>
			{/* Статистика */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>Всего резервных копий</CardTitle>
						<CardDescription>Успешных: {completedBackups}</CardDescription>
						<CardAction>
							<Save className='h-4 w-4 text-muted-foreground' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{totalBackups}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Общий размер</CardTitle>
						<CardDescription>Использовано хранилище</CardDescription>
						<CardAction>
							<HardDrive className='h-4 w-4 text-muted-foreground' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{totalSize.toFixed(1)} GB</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Последний бэкап</CardTitle>
						<CardDescription>
							Следующий: {formatDateShort(backupSchedule.nextBackup)}
						</CardDescription>
						<CardAction>
							<Clock className='h-4 w-4 text-muted-foreground' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatDateShort(backupSchedule.lastBackup)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Автобэкап</CardTitle>
						<CardDescription>Ежедневно в {backupSchedule.time}</CardDescription>
						<CardAction>
							<CheckCircle2 className='h-4 w-4 text-green-600' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>Включён</div>
					</CardContent>
				</Card>
			</div>

			{/* Настройки автоматического бэкапа */}
			<Card>
				<CardHeader>
					<CardTitle>Автоматическое резервное копирование</CardTitle>
					<CardDescription>
						Настройки регулярного создания резервных копий
					</CardDescription>
					<CardAction>
						<Button variant='outline'>Настроить расписание</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
						<div>
							<p className='text-sm font-medium mb-1'>Статус</p>
							<p className='text-2xl font-bold text-green-600'>Активен</p>
						</div>
						<div>
							<p className='text-sm font-medium mb-1'>Частота</p>
							<p className='text-2xl font-bold'>Ежедневно</p>
						</div>
						<div>
							<p className='text-sm font-medium mb-1'>Время</p>
							<p className='text-2xl font-bold'>{backupSchedule.time}</p>
						</div>
						<div>
							<p className='text-sm font-medium mb-1'>Хранить</p>
							<p className='text-2xl font-bold'>
								{backupSchedule.retention} дней
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Список резервных копий */}
			<Card>
				<CardHeader>
					<CardTitle>Резервные копии</CardTitle>
					<CardDescription>История резервного копирования</CardDescription>
					<CardAction>
						<Button>
							<Save className='w-4 h-4' />
							Создать резервную копию
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Название</TableHead>
								<TableHead>Тип</TableHead>
								<TableHead>Статус</TableHead>
								<TableHead>Базы данных</TableHead>
								<TableHead>Размер</TableHead>
								<TableHead>Создан</TableHead>
								<TableHead>Истекает</TableHead>
								<TableHead className='w-[50px]'></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{backups.map(backup => (
								<TableRow key={backup.id}>
									<TableCell className='font-medium'>{backup.name}</TableCell>
									<TableCell>{getTypeBadge(backup.type)}</TableCell>
									<TableCell>
										{getStatusBadge(backup.status)}
										{backup.status === 'in_progress' && backup.progress && (
											<div className='mt-2'>
												<Progress value={backup.progress} className='h-1' />
												<p className='text-xs text-muted-foreground mt-1'>
													{backup.progress}%
												</p>
											</div>
										)}
										{backup.status === 'failed' && backup.error && (
											<p className='text-xs text-destructive mt-1'>
												{backup.error}
											</p>
										)}
									</TableCell>
									<TableCell>
										<div className='text-sm'>
											{backup.databases.slice(0, 2).join(', ')}
											{backup.databases.length > 2 && (
												<span className='text-muted-foreground'>
													{' '}
													+{backup.databases.length - 2}
												</span>
											)}
										</div>
									</TableCell>
									<TableCell>{backup.size || '—'}</TableCell>
									<TableCell className='text-muted-foreground'>
										{formatDate(backup.createdAt)}
									</TableCell>
									<TableCell className='text-muted-foreground'>
										{backup.expiresAt ? formatDateShort(backup.expiresAt) : '—'}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant='ghost'
													size='icon'
													disabled={backup.status === 'in_progress'}
												>
													<MoreVertical className='w-4 h-4' />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												<DropdownMenuItem
													disabled={backup.status !== 'completed'}
												>
													<RotateCcw className='w-4 h-4' />
													Восстановить
												</DropdownMenuItem>
												<DropdownMenuItem
													disabled={backup.status !== 'completed'}
												>
													<Download className='w-4 h-4' />
													Скачать
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem className='text-destructive'>
													<Trash2 className='w-4 h-4' />
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

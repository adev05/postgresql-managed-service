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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	FileText,
	Search,
	Download,
	RefreshCw,
	AlertCircle,
	Info,
	AlertTriangle,
	XCircle,
} from 'lucide-react'
import { useState } from 'react'

// Моканные данные логов
const mockLogs = [
	{
		id: '1',
		timestamp: '2024-12-05T10:15:23.456Z',
		level: 'error',
		source: 'postgresql',
		message: 'Connection timeout for client 192.168.1.100:5432',
		details: 'FATAL: password authentication failed for user "app_user"',
	},
	{
		id: '2',
		timestamp: '2024-12-05T10:14:58.123Z',
		level: 'warning',
		source: 'replication',
		message: 'Replication lag detected: 2.3 seconds',
		details: 'Standby server pg-standby-01 is falling behind',
	},
	{
		id: '3',
		timestamp: '2024-12-05T10:14:45.789Z',
		level: 'info',
		source: 'autovacuum',
		message: 'Automatic vacuum of table "production.public.users" completed',
		details: 'Pages removed: 1234, Tuples removed: 5678, Duration: 45.2s',
	},
	{
		id: '4',
		timestamp: '2024-12-05T10:14:30.234Z',
		level: 'info',
		source: 'postgresql',
		message: 'Checkpoint starting: time',
		details: null,
	},
	{
		id: '5',
		timestamp: '2024-12-05T10:14:15.567Z',
		level: 'error',
		source: 'query',
		message: 'Query execution failed',
		details:
			'ERROR: duplicate key value violates unique constraint "users_email_key"',
	},
	{
		id: '6',
		timestamp: '2024-12-05T10:13:58.890Z',
		level: 'warning',
		source: 'connection',
		message: 'Too many connections from 192.168.1.50',
		details: 'Current connections: 45, Limit: 50 per IP',
	},
	{
		id: '7',
		timestamp: '2024-12-05T10:13:42.345Z',
		level: 'info',
		source: 'backup',
		message: 'Backup completed successfully',
		details: 'Size: 1.2 GB, Duration: 2m 34s',
	},
	{
		id: '8',
		timestamp: '2024-12-05T10:13:20.678Z',
		level: 'debug',
		source: 'postgresql',
		message: 'Statement: SELECT * FROM users WHERE id = $1',
		details: 'Duration: 0.234 ms',
	},
	{
		id: '9',
		timestamp: '2024-12-05T10:12:55.123Z',
		level: 'info',
		source: 'connection',
		message: 'New connection established',
		details: 'User: admin, Database: production, Client: 192.168.1.100',
	},
	{
		id: '10',
		timestamp: '2024-12-05T10:12:30.456Z',
		level: 'warning',
		source: 'performance',
		message: 'Slow query detected',
		details: 'Query: SELECT * FROM orders WHERE date > ... Duration: 15.6s',
	},
]

export default function LogsTab() {
	const [logs, setLogs] = useState(mockLogs)
	const [logLevel, setLogLevel] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')

	const formatTime = (timestamp: string) => {
		return new Date(timestamp).toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			fractionalSecondDigits: 3,
		})
	}

	const formatDate = (timestamp: string) => {
		return new Date(timestamp).toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})
	}

	const getLevelIcon = (level: string) => {
		switch (level) {
			case 'error':
				return <XCircle className='w-4 h-4 text-red-600' />
			case 'warning':
				return <AlertTriangle className='w-4 h-4 text-yellow-600' />
			case 'info':
				return <Info className='w-4 h-4 text-blue-600' />
			case 'debug':
				return <FileText className='w-4 h-4 text-gray-600' />
			default:
				return <AlertCircle className='w-4 h-4' />
		}
	}

	const getLevelBadge = (level: string) => {
		const variants: Record<
			string,
			'default' | 'secondary' | 'destructive' | 'outline'
		> = {
			error: 'destructive',
			warning: 'default',
			info: 'default',
			debug: 'secondary',
		}
		return (
			<Badge
				variant={variants[level] || 'secondary'}
				className='uppercase text-xs'
			>
				{level}
			</Badge>
		)
	}

	const filteredLogs = logs.filter(log => {
		const matchesLevel = logLevel === 'all' || log.level === logLevel
		const matchesSearch =
			searchQuery === '' ||
			log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
			log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(log.details &&
				log.details.toLowerCase().includes(searchQuery.toLowerCase()))
		return matchesLevel && matchesSearch
	})

	const errorCount = logs.filter(l => l.level === 'error').length
	const warningCount = logs.filter(l => l.level === 'warning').length
	const infoCount = logs.filter(l => l.level === 'info').length

	return (
		<div className='space-y-4'>
			{/* Статистика */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>Всего записей</CardTitle>
						<CardDescription>За последние 24 часа</CardDescription>
						<CardAction>
							<FileText className='h-4 w-4 text-muted-foreground' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{logs.length}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Ошибки</CardTitle>
						<CardDescription>Требуют внимания</CardDescription>
						<CardAction>
							<XCircle className='h-4 w-4 text-red-600' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-red-600'>{errorCount}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Предупреждения</CardTitle>
						<CardDescription>Стоит проверить</CardDescription>
						<CardAction>
							<AlertTriangle className='h-4 w-4 text-yellow-600' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-yellow-600'>
							{warningCount}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Информация</CardTitle>
						<CardDescription>Обычные события</CardDescription>
						<CardAction>
							<Info className='h-4 w-4 text-blue-600' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-blue-600'>{infoCount}</div>
					</CardContent>
				</Card>
			</div>

			{/* Фильтры и управление */}
			<Card>
				<CardHeader>
					<CardTitle>Журнал событий</CardTitle>
					<CardDescription>
						Логи работы кластера в реальном времени
					</CardDescription>
					<CardAction>
						<Button variant='outline' size='icon' className='mr-2'>
							<RefreshCw className='w-4 h-4' />
						</Button>
						<Button variant='outline'>
							<Download className='w-4 h-4' />
							Экспорт
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent className='space-y-4'>
					{/* Фильтры */}
					<div className='flex flex-col md:flex-row gap-4'>
						<div className='flex-1'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
								<Input
									placeholder='Поиск по логам...'
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
									className='pl-9'
								/>
							</div>
						</div>
						<Select value={logLevel} onValueChange={setLogLevel}>
							<SelectTrigger className='w-full md:w-[200px]'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>Все уровни</SelectItem>
								<SelectItem value='error'>Ошибки</SelectItem>
								<SelectItem value='warning'>Предупреждения</SelectItem>
								<SelectItem value='info'>Информация</SelectItem>
								<SelectItem value='debug'>Отладка</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Список логов */}
					<ScrollArea className='h-[600px] w-full rounded-md border'>
						<div className='p-4 space-y-3'>
							{filteredLogs.length === 0 ? (
								<div className='text-center py-8 text-muted-foreground'>
									Логи не найдены
								</div>
							) : (
								filteredLogs.map(log => (
									<div
										key={log.id}
										className='border rounded-lg p-4 hover:bg-accent/50 transition-colors'
									>
										<div className='flex items-start gap-3'>
											<div className='mt-1'>{getLevelIcon(log.level)}</div>
											<div className='flex-1 space-y-2'>
												<div className='flex items-center gap-2 flex-wrap'>
													{getLevelBadge(log.level)}
													<Badge variant='outline' className='text-xs'>
														{log.source}
													</Badge>
													<span className='text-xs text-muted-foreground'>
														{formatDate(log.timestamp)}{' '}
														{formatTime(log.timestamp)}
													</span>
												</div>
												<p className='text-sm font-medium'>{log.message}</p>
												{log.details && (
													<p className='text-sm text-muted-foreground font-mono bg-muted p-2 rounded'>
														{log.details}
													</p>
												)}
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</ScrollArea>

					<div className='flex items-center justify-between text-sm text-muted-foreground'>
						<span>
							Показано {filteredLogs.length} из {logs.length} записей
						</span>
						<span>
							Обновлено: {formatDate(new Date().toISOString())}{' '}
							{formatTime(new Date().toISOString())}
						</span>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

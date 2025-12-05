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
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Network,
	Activity,
	XCircle,
	MoreVertical,
	Search,
	RefreshCw,
	Zap,
	Clock,
} from 'lucide-react'
import { useState } from 'react'

// Моканные данные подключений
const mockConnections = [
	{
		id: '1',
		pid: 12345,
		user: 'app_user',
		database: 'production',
		clientAddress: '192.168.1.100',
		applicationName: 'NodeJS App',
		state: 'active',
		query: "SELECT * FROM orders WHERE created_at > NOW() - INTERVAL '1 day'",
		queryStart: '2024-12-05T10:14:23.456Z',
		duration: '0.234s',
		waitEvent: null,
	},
	{
		id: '2',
		pid: 12346,
		user: 'admin',
		database: 'production',
		clientAddress: '192.168.1.50',
		applicationName: 'pgAdmin',
		state: 'idle',
		query: 'SELECT version()',
		queryStart: '2024-12-05T10:10:15.123Z',
		duration: '4m 8s',
		waitEvent: null,
	},
	{
		id: '3',
		pid: 12347,
		user: 'app_user',
		database: 'production',
		clientAddress: '192.168.1.101',
		applicationName: 'Python Script',
		state: 'active',
		query: 'UPDATE users SET last_login = NOW() WHERE id = 1234',
		queryStart: '2024-12-05T10:14:20.789Z',
		duration: '3.456s',
		waitEvent: 'Lock',
	},
	{
		id: '4',
		pid: 12348,
		user: 'readonly_user',
		database: 'analytics',
		clientAddress: '192.168.1.75',
		applicationName: 'Metabase',
		state: 'active',
		query:
			"SELECT date_trunc('day', created_at), COUNT(*) FROM events GROUP BY 1",
		queryStart: '2024-12-05T10:13:45.234Z',
		duration: '30.567s',
		waitEvent: null,
	},
	{
		id: '5',
		pid: 12349,
		user: 'app_user',
		database: 'production',
		clientAddress: '192.168.1.100',
		applicationName: 'NodeJS App',
		state: 'idle in transaction',
		query: 'BEGIN',
		queryStart: '2024-12-05T10:12:30.678Z',
		duration: '1m 53s',
		waitEvent: null,
	},
	{
		id: '6',
		pid: 12350,
		user: 'data_team',
		database: 'analytics',
		clientAddress: '192.168.1.80',
		applicationName: 'Jupyter',
		state: 'active',
		query: 'SELECT * FROM large_table WHERE condition = true',
		queryStart: '2024-12-05T10:13:00.123Z',
		duration: '1m 23s',
		waitEvent: 'IO',
	},
	{
		id: '7',
		pid: 12351,
		user: 'admin',
		database: 'defaultdb',
		clientAddress: '192.168.1.50',
		applicationName: 'psql',
		state: 'idle',
		query: 'SHOW server_version',
		queryStart: '2024-12-05T10:05:12.456Z',
		duration: '9m 11s',
		waitEvent: null,
	},
]

export default function ConnectionsTab() {
	const [connections] = useState(mockConnections)
	const [searchQuery, setSearchQuery] = useState('')

	const formatDuration = (duration: string) => {
		return duration
	}

	const getStateBadge = (state: string) => {
		switch (state) {
			case 'active':
				return (
					<Badge
						variant='outline'
						className='bg-green-50 text-green-700 border-green-200'
					>
						Активное
					</Badge>
				)
			case 'idle':
				return (
					<Badge
						variant='outline'
						className='bg-gray-50 text-gray-700 border-gray-200'
					>
						Простой
					</Badge>
				)
			case 'idle in transaction':
				return (
					<Badge
						variant='outline'
						className='bg-yellow-50 text-yellow-700 border-yellow-200'
					>
						Транзакция
					</Badge>
				)
			default:
				return <Badge variant='secondary'>{state}</Badge>
		}
	}

	const filteredConnections = connections.filter(conn => {
		if (searchQuery === '') return true
		const query = searchQuery.toLowerCase()
		return (
			conn.user.toLowerCase().includes(query) ||
			conn.database.toLowerCase().includes(query) ||
			conn.clientAddress.toLowerCase().includes(query) ||
			conn.applicationName.toLowerCase().includes(query) ||
			conn.query.toLowerCase().includes(query)
		)
	})

	const activeConnections = connections.filter(c => c.state === 'active').length
	const idleConnections = connections.filter(c => c.state === 'idle').length
	const transactionConnections = connections.filter(
		c => c.state === 'idle in transaction'
	).length

	return (
		<div className='space-y-4'>
			{/* Статистика */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>Всего подключений</CardTitle>
						<CardDescription>Максимум: 200</CardDescription>
						<CardAction>
							<Network className='h-4 w-4 text-muted-foreground' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{connections.length}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Активные</CardTitle>
						<CardDescription>Выполняют запросы</CardDescription>
						<CardAction>
							<Zap className='h-4 w-4 text-green-600' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-green-600'>
							{activeConnections}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Простаивающие</CardTitle>
						<CardDescription>Ожидают команд</CardDescription>
						<CardAction>
							<Clock className='h-4 w-4 text-gray-600' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-gray-600'>
							{idleConnections}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>В транзакции</CardTitle>
						<CardDescription>Открытые транзакции</CardDescription>
						<CardAction>
							<Activity className='h-4 w-4 text-yellow-600' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-yellow-600'>
							{transactionConnections}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Список подключений */}
			<Card>
				<CardHeader>
					<CardTitle>Активные подключения</CardTitle>
					<CardDescription>Текущие подключения к базе данных</CardDescription>
					<CardAction>
						<Button variant='outline' size='icon'>
							<RefreshCw className='w-4 h-4' />
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent className='space-y-4'>
					{/* Поиск */}
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
						<Input
							placeholder='Поиск по пользователю, базе, IP или запросу...'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							className='pl-9'
						/>
					</div>

					{/* Таблица подключений */}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>PID</TableHead>
								<TableHead>Пользователь</TableHead>
								<TableHead>База данных</TableHead>
								<TableHead>Статус</TableHead>
								<TableHead>Клиент</TableHead>
								<TableHead>Приложение</TableHead>
								<TableHead>Длительность</TableHead>
								<TableHead className='w-[50px]'></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredConnections.map(conn => (
								<TableRow key={conn.id}>
									<TableCell className='font-mono text-sm'>
										{conn.pid}
									</TableCell>
									<TableCell className='font-medium'>{conn.user}</TableCell>
									<TableCell>{conn.database}</TableCell>
									<TableCell>
										{getStateBadge(conn.state)}
										{conn.waitEvent && (
											<Badge variant='outline' className='ml-2 text-xs'>
												{conn.waitEvent}
											</Badge>
										)}
									</TableCell>
									<TableCell className='font-mono text-sm'>
										{conn.clientAddress}
									</TableCell>
									<TableCell className='text-muted-foreground'>
										{conn.applicationName}
									</TableCell>
									<TableCell className='font-mono text-sm'>
										{formatDuration(conn.duration)}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant='ghost' size='icon'>
													<MoreVertical className='w-4 h-4' />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												<DropdownMenuItem>Показать запрос</DropdownMenuItem>
												<DropdownMenuItem className='text-destructive'>
													<XCircle className='w-4 h-4 mr-2' />
													Завершить подключение
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					{filteredConnections.length === 0 && (
						<div className='text-center py-8 text-muted-foreground'>
							Подключения не найдены
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

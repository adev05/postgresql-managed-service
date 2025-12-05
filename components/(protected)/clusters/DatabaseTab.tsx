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
import {
	Database,
	MoreVertical,
	Plus,
	Trash2,
	Users,
	HardDrive,
} from 'lucide-react'
import { useState } from 'react'

// Моканные данные баз данных
const mockDatabases = [
	{
		id: '1',
		name: 'defaultdb',
		owner: 'postgres',
		encoding: 'UTF8',
		size: '245 MB',
		tables: 12,
		connections: 5,
		createdAt: '2024-11-15T10:00:00Z',
	},
	{
		id: '2',
		name: 'production',
		owner: 'admin',
		encoding: 'UTF8',
		size: '1.2 GB',
		tables: 45,
		connections: 23,
		createdAt: '2024-11-16T14:30:00Z',
	},
	{
		id: '3',
		name: 'staging',
		owner: 'admin',
		encoding: 'UTF8',
		size: '856 MB',
		tables: 38,
		connections: 8,
		createdAt: '2024-11-18T09:15:00Z',
	},
	{
		id: '4',
		name: 'analytics',
		owner: 'data_team',
		encoding: 'UTF8',
		size: '3.4 GB',
		tables: 67,
		connections: 12,
		createdAt: '2024-11-20T11:45:00Z',
	},
]

export default function DatabasesTab() {
	const [databases] = useState(mockDatabases)

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	return (
		<div className='space-y-4'>
			{/* Статистика */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>Всего баз данных</CardTitle>
						<CardDescription>Общий размер: 5.7 GB</CardDescription>
						<CardAction>
							<Database className='h-4 w-4 text-muted-foreground' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{databases.length}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Активных подключений</CardTitle>
						<CardDescription>Максимум: 200</CardDescription>
						<CardAction>
							<Users className='h-4 w-4 text-muted-foreground' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>48</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Всего таблиц</CardTitle>
						<CardDescription>Во всех базах данных</CardDescription>
						<CardAction>
							<HardDrive className='h-4 w-4 text-muted-foreground' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>162</div>
					</CardContent>
				</Card>
			</div>

			{/* Список баз данных */}
			<Card>
				<CardHeader>
					<CardTitle>Базы данных</CardTitle>
					<CardDescription>Управление базами данных в кластере</CardDescription>
					<CardAction>
						<Button>
							<Plus className='w-4 h-4' />
							Создать базу данных
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Название</TableHead>
								<TableHead>Владелец</TableHead>
								<TableHead>Кодировка</TableHead>
								<TableHead>Размер</TableHead>
								<TableHead>Таблицы</TableHead>
								<TableHead>Подключения</TableHead>
								<TableHead>Создана</TableHead>
								<TableHead className='w-[50px]'></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{databases.map(db => (
								<TableRow key={db.id}>
									<TableCell className='font-medium'>
										<div className='flex items-center gap-2'>
											<Database className='w-4 h-4 text-muted-foreground' />
											{db.name}
										</div>
									</TableCell>
									<TableCell>{db.owner}</TableCell>
									<TableCell>{db.encoding}</TableCell>
									<TableCell>{db.size}</TableCell>
									<TableCell>{db.tables}</TableCell>
									<TableCell>{db.connections}</TableCell>
									<TableCell className='text-muted-foreground'>
										{formatDate(db.createdAt)}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant='ghost' size='icon'>
													<MoreVertical className='w-4 h-4' />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												<DropdownMenuItem>Подключиться</DropdownMenuItem>
												<DropdownMenuItem>Настройки</DropdownMenuItem>
												<DropdownMenuItem>Резервная копия</DropdownMenuItem>
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

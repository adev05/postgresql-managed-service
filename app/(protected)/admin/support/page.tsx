// 'use client'

// import React from 'react'
// import { ColumnDef } from '@tanstack/react-table'
// import { DataTable } from '@/components/ui/data-table'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuSeparator,
// 	DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'

// interface SupportTicket {
// 	id: string
// 	title: string
// 	description: string
// 	priority: 'low' | 'medium' | 'high' | 'critical'
// 	status: 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed'
// 	creator: string
// 	creatorEmail: string
// 	createdAt: string
// 	updatedAt: string
// }

// // Замокированные данные
// const mockTickets: SupportTicket[] = [
// 	{
// 		id: 'TKT-001',
// 		title: 'Ошибка при подключении к базе данных',
// 		description: 'Невозможно подключиться к основному кластеру',
// 		priority: 'critical',
// 		status: 'in-progress',
// 		creator: 'John Doe',
// 		creatorEmail: 'john@example.com',
// 		createdAt: '2024-03-15',
// 		updatedAt: '2024-03-20',
// 	},
// 	{
// 		id: 'TKT-002',
// 		title: 'Запрос на увеличение лимита памяти',
// 		description: 'Нужно увеличить память для cluster-prod',
// 		priority: 'high',
// 		status: 'pending',
// 		creator: 'Jane Smith',
// 		creatorEmail: 'jane@example.com',
// 		createdAt: '2024-03-18',
// 		updatedAt: '2024-03-19',
// 	},
// 	{
// 		id: 'TKT-003',
// 		title: 'Интеграция с внешним API',
// 		description: 'Помощь в интеграции с новым API',
// 		priority: 'medium',
// 		status: 'open',
// 		creator: 'Alex Johnson',
// 		creatorEmail: 'alex@example.com',
// 		createdAt: '2024-03-20',
// 		updatedAt: '2024-03-20',
// 	},
// 	{
// 		id: 'TKT-004',
// 		title: 'Проблема с бэкапом',
// 		description: 'Автоматический бэкап не запускается',
// 		priority: 'high',
// 		status: 'resolved',
// 		creator: 'Maria Garcia',
// 		creatorEmail: 'maria@example.com',
// 		createdAt: '2024-03-10',
// 		updatedAt: '2024-03-17',
// 	},
// 	{
// 		id: 'TKT-005',
// 		title: 'Вопрос по документации',
// 		description: 'Нужна информация по использованию API',
// 		priority: 'low',
// 		status: 'closed',
// 		creator: 'User Support',
// 		creatorEmail: 'support@example.com',
// 		createdAt: '2024-02-28',
// 		updatedAt: '2024-03-05',
// 	},
// ]

// const columns: ColumnDef<SupportTicket>[] = [
// 	{
// 		accessorKey: 'id',
// 		header: 'Тикет ID',
// 		cell: ({ row }) => (
// 			<div className='font-mono font-medium text-sm'>{row.original.id}</div>
// 		),
// 		size: 100,
// 	},
// 	{
// 		accessorKey: 'title',
// 		header: 'Тема',
// 		cell: ({ row }) => {
// 			return (
// 				<div>
// 					<div className='font-medium'>{row.original.title}</div>
// 					<div className='text-xs text-muted-foreground line-clamp-1'>
// 						{row.original.description}
// 					</div>
// 				</div>
// 			)
// 		},
// 		enableHiding: false,
// 	},
// 	{
// 		accessorKey: 'priority',
// 		header: 'Приоритет',
// 		cell: ({ row }) => {
// 			const priorityConfig = {
// 				low: { label: 'Низкий', variant: 'secondary' as const },
// 				medium: { label: 'Средний', variant: 'default' as const },
// 				high: { label: 'Высокий', variant: 'destructive' as const },
// 				critical: { label: 'Критический', variant: 'destructive' as const },
// 			}
// 			return (
// 				<Badge variant={priorityConfig[row.original.priority].variant}>
// 					{priorityConfig[row.original.priority].label}
// 				</Badge>
// 			)
// 		},
// 	},
// 	{
// 		accessorKey: 'status',
// 		header: 'Статус',
// 		cell: ({ row }) => {
// 			const statusConfig = {
// 				open: { label: 'Открыт', variant: 'outline' as const },
// 				'in-progress': { label: 'В работе', variant: 'default' as const },
// 				pending: { label: 'Ожидание', variant: 'secondary' as const },
// 				resolved: { label: 'Решено', variant: 'outline' as const },
// 				closed: { label: 'Закрыто', variant: 'secondary' as const },
// 			}
// 			return (
// 				<Badge variant={statusConfig[row.original.status].variant}>
// 					{statusConfig[row.original.status].label}
// 				</Badge>
// 			)
// 		},
// 	},
// 	{
// 		accessorKey: 'creator',
// 		header: 'От кого',
// 		cell: ({ row }) => (
// 			<div>
// 				<div className='text-sm'>{row.original.creator}</div>
// 				<div className='text-xs text-muted-foreground'>
// 					{row.original.creatorEmail}
// 				</div>
// 			</div>
// 		),
// 	},
// 	{
// 		accessorKey: 'createdAt',
// 		header: 'Создан',
// 		cell: ({ row }) => (
// 			<div className='text-sm text-muted-foreground'>
// 				{row.original.createdAt}
// 			</div>
// 		),
// 	},
// 	{
// 		id: 'actions',
// 		cell: () => (
// 			<DropdownMenu>
// 				<DropdownMenuTrigger asChild>
// 					<Button
// 						variant='ghost'
// 						className='data-[state=open]:bg-muted h-8 w-8 p-0'
// 					>
// 						<EllipsisVerticalIcon className='w-4 h-4 text-muted-foreground' />
// 						<span className='sr-only'>Открыть меню</span>
// 					</Button>
// 				</DropdownMenuTrigger>
// 				<DropdownMenuContent align='end' className='w-40'>
// 					<DropdownMenuItem>Просмотр</DropdownMenuItem>
// 					<DropdownMenuItem>Ответить</DropdownMenuItem>
// 					<DropdownMenuSeparator />
// 					<DropdownMenuItem>Изменить статус</DropdownMenuItem>
// 					<DropdownMenuItem>Изменить приоритет</DropdownMenuItem>
// 					<DropdownMenuSeparator />
// 					<DropdownMenuItem className='text-red-600'>Удалить</DropdownMenuItem>
// 				</DropdownMenuContent>
// 			</DropdownMenu>
// 		),
// 	},
// ]

// export default function SupportTicketsPage() {
// 	return (
// 		<DataTable
// 			columns={columns}
// 			data={mockTickets}
// 			filterPlaceholder='Поиск по ID или теме...'
// 			filterColumnId='id'
// 		/>
// 	)
// }

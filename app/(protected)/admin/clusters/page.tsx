// 'use client'

// import React from 'react'
// import { ColumnDef } from '@tanstack/react-table'
// import { DataTable } from '@/components/ui/data-table'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Progress } from '@/components/ui/progress'
// import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuSeparator,
// 	DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'

// interface ClusterAdmin {
// 	id: string
// 	name: string
// 	owner: string
// 	ownerEmail: string
// 	status: 'healthy' | 'degraded' | 'critical' | 'offline'
// 	nodeCount: number
// 	databaseCount: number
// 	storageUsed: number // Процент
// 	backupStatus: 'active' | 'pending' | 'failed'
// 	lastBackup: string
// 	createdAt: string
// }

// // Замокированные данные
// const mockClusters: ClusterAdmin[] = [
// 	{
// 		id: 'cluster-prod',
// 		name: 'Production Cluster',
// 		owner: 'John Doe',
// 		ownerEmail: 'john@example.com',
// 		status: 'healthy',
// 		nodeCount: 3,
// 		databaseCount: 15,
// 		storageUsed: 72,
// 		backupStatus: 'active',
// 		lastBackup: '2024-03-20 14:30',
// 		createdAt: '2024-01-15',
// 	},
// 	{
// 		id: 'cluster-staging',
// 		name: 'Staging Cluster',
// 		owner: 'Jane Smith',
// 		ownerEmail: 'jane@example.com',
// 		status: 'healthy',
// 		nodeCount: 2,
// 		databaseCount: 8,
// 		storageUsed: 45,
// 		backupStatus: 'active',
// 		lastBackup: '2024-03-20 13:00',
// 		createdAt: '2024-02-01',
// 	},
// 	{
// 		id: 'cluster-dev',
// 		name: 'Development Cluster',
// 		owner: 'Alex Johnson',
// 		ownerEmail: 'alex@example.com',
// 		status: 'degraded',
// 		nodeCount: 1,
// 		databaseCount: 5,
// 		storageUsed: 28,
// 		backupStatus: 'pending',
// 		lastBackup: '2024-03-19 09:15',
// 		createdAt: '2024-01-20',
// 	},
// 	{
// 		id: 'cluster-testing',
// 		name: 'Testing Cluster',
// 		owner: 'Maria Garcia',
// 		ownerEmail: 'maria@example.com',
// 		status: 'healthy',
// 		nodeCount: 2,
// 		databaseCount: 6,
// 		storageUsed: 38,
// 		backupStatus: 'active',
// 		lastBackup: '2024-03-20 12:00',
// 		createdAt: '2024-02-10',
// 	},
// 	{
// 		id: 'cluster-archived',
// 		name: 'Archived Cluster',
// 		owner: 'User Support',
// 		ownerEmail: 'support@example.com',
// 		status: 'offline',
// 		nodeCount: 0,
// 		databaseCount: 0,
// 		storageUsed: 0,
// 		backupStatus: 'failed',
// 		lastBackup: '2024-03-01 00:00',
// 		createdAt: '2023-12-01',
// 	},
// ]

// const columns: ColumnDef<ClusterAdmin>[] = [
// 	{
// 		accessorKey: 'name',
// 		header: 'Кластер',
// 		cell: ({ row }) => {
// 			return (
// 				<div>
// 					<div className='font-medium'>{row.original.name}</div>
// 					<div className='text-xs text-muted-foreground'>{row.original.id}</div>
// 				</div>
// 			)
// 		},
// 		enableHiding: false,
// 	},
// 	{
// 		accessorKey: 'owner',
// 		header: 'Владелец',
// 		cell: ({ row }) => (
// 			<div>
// 				<div className='text-sm'>{row.original.owner}</div>
// 				<div className='text-xs text-muted-foreground'>
// 					{row.original.ownerEmail}
// 				</div>
// 			</div>
// 		),
// 	},
// 	{
// 		accessorKey: 'status',
// 		header: 'Статус',
// 		cell: ({ row }) => {
// 			const statusConfig = {
// 				healthy: { label: 'Здоров', variant: 'default' as const },
// 				degraded: { label: 'Деградирован', variant: 'secondary' as const },
// 				critical: { label: 'Критический', variant: 'destructive' as const },
// 				offline: { label: 'Офлайн', variant: 'outline' as const },
// 			}
// 			return (
// 				<Badge variant={statusConfig[row.original.status].variant}>
// 					{statusConfig[row.original.status].label}
// 				</Badge>
// 			)
// 		},
// 	},
// 	{
// 		accessorKey: 'nodeCount',
// 		header: 'Ноды',
// 		cell: ({ row }) => (
// 			<div className='text-center'>{row.original.nodeCount}</div>
// 		),
// 	},
// 	{
// 		accessorKey: 'databaseCount',
// 		header: 'БД',
// 		cell: ({ row }) => (
// 			<div className='text-center'>{row.original.databaseCount}</div>
// 		),
// 	},
// 	{
// 		accessorKey: 'storageUsed',
// 		header: 'Хранилище',
// 		cell: ({ row }) => (
// 			<div className='space-y-1'>
// 				<div className='text-sm font-medium'>{row.original.storageUsed}%</div>
// 				<Progress value={row.original.storageUsed} className='h-2' />
// 			</div>
// 		),
// 	},
// 	{
// 		accessorKey: 'backupStatus',
// 		header: 'Бэкап',
// 		cell: ({ row }) => {
// 			const backupConfig = {
// 				active: { label: 'Активен', variant: 'default' as const },
// 				pending: { label: 'Ожидание', variant: 'secondary' as const },
// 				failed: { label: 'Ошибка', variant: 'destructive' as const },
// 			}
// 			return (
// 				<div>
// 					<Badge variant={backupConfig[row.original.backupStatus].variant}>
// 						{backupConfig[row.original.backupStatus].label}
// 					</Badge>
// 					<div className='text-xs text-muted-foreground mt-1'>
// 						{row.original.lastBackup}
// 					</div>
// 				</div>
// 			)
// 		},
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
// 					<DropdownMenuItem>Просмотр деталей</DropdownMenuItem>
// 					<DropdownMenuItem>Принудительный бэкап</DropdownMenuItem>
// 					<DropdownMenuSeparator />
// 					<DropdownMenuItem>Перезагрузить</DropdownMenuItem>
// 					<DropdownMenuItem>Изменить ресурсы</DropdownMenuItem>
// 					<DropdownMenuSeparator />
// 					<DropdownMenuItem className='text-red-600'>Удалить</DropdownMenuItem>
// 				</DropdownMenuContent>
// 			</DropdownMenu>
// 		),
// 	},
// ]

// export default function ClustersManagementPage() {
// 	return (
// 		<DataTable
// 			columns={columns}
// 			data={mockClusters}
// 			filterPlaceholder='Поиск по названию или ID...'
// 			filterColumnId='name'
// 		/>
// 	)
// }

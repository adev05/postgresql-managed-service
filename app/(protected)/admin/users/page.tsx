'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface User {
	id: string
	username: string
	firstName: string
	lastName: string
	email: string
	status: 'active' | 'inactive' | 'blocked'
	permissionLevel: 1 | 2048
	createdAt: string
}

// Замокированные данные
const mockUsers: User[] = [
	{
		id: '1',
		username: 'john_doe',
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
		status: 'active',
		permissionLevel: 1,
		createdAt: '2024-01-15',
	},
	{
		id: '2',
		username: 'jane_smith',
		firstName: 'Jane',
		lastName: 'Smith',
		email: 'jane@example.com',
		status: 'active',
		permissionLevel: 2048,
		createdAt: '2024-01-10',
	},
	{
		id: '3',
		username: 'admin_user',
		firstName: 'Admin',
		lastName: 'User',
		email: 'admin@example.com',
		status: 'active',
		permissionLevel: 2048,
		createdAt: '2023-12-01',
	},
	{
		id: '4',
		username: 'alex_johnson',
		firstName: 'Alex',
		lastName: 'Johnson',
		email: 'alex@example.com',
		status: 'inactive',
		permissionLevel: 1,
		createdAt: '2024-02-20',
	},
	{
		id: '5',
		username: 'blocked_user',
		firstName: 'Blocked',
		lastName: 'User',
		email: 'blocked@example.com',
		status: 'blocked',
		permissionLevel: 1,
		createdAt: '2024-03-01',
	},
]

const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'username',
		header: 'Пользователь',
		cell: ({ row }) => {
			return (
				<div>
					<div className='font-medium'>{row.original.username}</div>
					<div className='text-xs text-muted-foreground'>
						{row.original.email}
					</div>
				</div>
			)
		},
		enableHiding: false,
	},
	{
		accessorKey: 'firstName',
		header: 'Имя',
		cell: ({ row }) => (
			<div>
				{row.original.firstName} {row.original.lastName}
			</div>
		),
	},
	{
		accessorKey: 'status',
		header: 'Статус',
		cell: ({ row }) => {
			const statusConfig = {
				active: { label: 'Активен', variant: 'default' as const },
				inactive: { label: 'Неактивен', variant: 'secondary' as const },
				blocked: { label: 'Заблокирован', variant: 'destructive' as const },
			}
			return (
				<Badge variant={statusConfig[row.original.status].variant}>
					{statusConfig[row.original.status].label}
				</Badge>
			)
		},
	},
	{
		accessorKey: 'permissionLevel',
		header: 'Роль',
		cell: ({ row }) => {
			const isAdmin = row.original.permissionLevel === 2048
			return (
				<Badge variant={isAdmin ? 'default' : 'outline'}>
					{isAdmin ? 'Администратор' : 'Пользователь'}
				</Badge>
			)
		},
	},
	{
		accessorKey: 'createdAt',
		header: 'Дата создания',
		cell: ({ row }) => (
			<div className='text-sm text-muted-foreground'>
				{row.original.createdAt}
			</div>
		),
	},
	{
		id: 'actions',
		cell: () => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						className='data-[state=open]:bg-muted h-8 w-8 p-0'
					>
						<EllipsisVerticalIcon className='w-4 h-4 text-muted-foreground' />
						<span className='sr-only'>Открыть меню</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-40'>
					<DropdownMenuItem>Просмотр профиля</DropdownMenuItem>
					<DropdownMenuItem>Изменить роль</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Деактивировать</DropdownMenuItem>
					<DropdownMenuItem className='text-red-600'>Удалить</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
]

export default function UsersManagementPage() {
	return (
		<DataTable
			columns={columns}
			data={mockUsers}
			filterPlaceholder='Поиск по имени или email...'
			filterColumnId='username'
		/>
	)
}

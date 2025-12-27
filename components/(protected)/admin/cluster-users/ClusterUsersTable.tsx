'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { fetchClusterUsers } from '@/lib/actions/cluster-users'
import { ClusterUser } from '@/types/cluster-user'
import CreateClusterUserDialog from './CreateClusterUserDialog'
import { deleteClusterUser } from '@/actions/cluster-user'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

interface ClusterUsersTableProps {
	clusterId: string
	initialUsers: ClusterUser[]
	initialTotal: number
}

export default function ClusterUsersTable({
	clusterId,
	initialUsers,
	initialTotal,
}: ClusterUsersTableProps) {
	const [data, setData] = React.useState<ClusterUser[]>(initialUsers)
	const [totalRows, setTotalRows] = React.useState(initialTotal)
	const [isLoading, setIsLoading] = React.useState(false)

	const handlePaginationChange = React.useCallback(
		async (pageSize: number, offset: number) => {
			setIsLoading(true)
			try {
				const result = await fetchClusterUsers(clusterId, pageSize, offset)
				setData(result.cluster_users)
				setTotalRows(result.total)
			} catch (error) {
				console.error('Error loading users:', error)
			} finally {
				setIsLoading(false)
			}
		},
		[clusterId]
	)

	const handleRefresh = async () => {
		await handlePaginationChange(10, 0)
	}

	const handleUserCreated = () => {
		handleRefresh()
	}

	const handleDeleteClick = async (user: ClusterUser) => {
		if (user.status.status === 'DELETED') return

		if (
			!confirm(
				`Вы уверены, что хотите удалить пользователя "${user.username}"?`
			)
		) {
			return
		}

		try {
			await deleteClusterUser(clusterId, user.id)
			await handleRefresh()
		} catch (error) {
			console.error('Error deleting user:', error)
			alert(
				error instanceof Error
					? error.message
					: 'Ошибка при удалении пользователя'
			)
		}
	}

	const clusterUsersColumns: ColumnDef<ClusterUser>[] = [
		{
			id: 'select',
			header: ({ table }) => (
				<div className='flex items-center justify-center'>
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && 'indeterminate')
						}
						onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
						aria-label='Select all'
					/>
				</div>
			),
			cell: ({ row }) => (
				<div className='flex items-center justify-center'>
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={value => row.toggleSelected(!!value)}
						aria-label='Select row'
					/>
				</div>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'username',
			header: 'Имя пользователя',
			cell: ({ row }) => (
				<span className='font-medium font-mono'>{row.original.username}</span>
			),
			enableHiding: false,
		},
		{
			accessorKey: 'permissions',
			header: 'Разрешения',
			cell: ({ row }) => {
				const permissions = row.original.permissions.split(',')
				return (
					<div className='flex flex-wrap gap-1'>
						{permissions.map(perm => (
							<Badge key={perm} variant='outline' className='text-xs'>
								{perm}
							</Badge>
						))}
					</div>
				)
			},
			enableHiding: false,
		},
		{
			accessorKey: 'status',
			header: 'Статус',
			cell: ({ row }) => {
				const status = row.original.status.status
				const isDeleted = status === 'DELETED'

				return (
					<Badge variant={isDeleted ? 'destructive' : 'default'}>
						{status}
					</Badge>
				)
			},
			enableHiding: true,
		},
		{
			accessorKey: 'created_at',
			header: 'Создан',
			cell: ({ row }) => {
				try {
					return (
						<span className='text-sm text-muted-foreground'>
							{formatDistanceToNow(new Date(row.original.created_at), {
								addSuffix: true,
								locale: ru,
							})}
						</span>
					)
				} catch {
					return <span className='text-sm text-muted-foreground'>-</span>
				}
			},
			enableHiding: true,
		},
		{
			accessorKey: 'updated_at',
			header: 'Обновлен',
			cell: ({ row }) => {
				try {
					return (
						<span className='text-sm text-muted-foreground'>
							{formatDistanceToNow(new Date(row.original.updated_at), {
								addSuffix: true,
								locale: ru,
							})}
						</span>
					)
				} catch {
					return <span className='text-sm text-muted-foreground'>-</span>
				}
			},
			enableHiding: true,
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const isDeleted = row.original.status.status === 'DELETED'
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
								size='icon'
								disabled={isDeleted}
							>
								<EllipsisVerticalIcon className='w-4 h-4' />
								<span className='sr-only'>Open menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-32'>
							<DropdownMenuItem
								variant='destructive'
								onClick={() => handleDeleteClick(row.original)}
								disabled={isDeleted}
							>
								Удалить
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
		},
	]

	return (
		<DataTable
			columns={clusterUsersColumns}
			data={data}
			totalRows={totalRows}
			onPaginationChange={handlePaginationChange}
			isLoading={isLoading}
			searchPlaceholder='Поиск по имени пользователя'
			searchable
			emptyMessage='Пользователи не найдены'
			customActions={
				<CreateClusterUserDialog
					clusterId={clusterId}
					onUserCreated={handleUserCreated}
				/>
			}
		/>
	)
}

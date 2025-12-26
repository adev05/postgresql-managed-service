'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import {
	EllipsisVerticalIcon,
	ChevronDownIcon,
} from '@heroicons/react/24/solid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { fetchHyperVHosts } from '@/lib/actions/hyperv-hosts'
import { HyperVHost } from '@/types/hyperv-host'
import {
	HYPERVHOST_STATUS,
	HYPERVHOST_STATUS_ID_MAP,
	HyperVHostStatusKey,
} from '@/constants/hyperVHostStatuses'
import CreateHyperVHostDialog from './CreateHyperVHostDialog'
import EditHyperVHostDialog from './EditHyperVHostDialog'
import HyperVHostAuditLogs from './HyperVHostAuditLogs'
import { deleteHyperVHost, updateHyperVHostStatus } from '@/actions/hyperv-host'

interface HyperVHostsTableProps {
	initialHosts: HyperVHost[]
	initialTotal: number
}

export default function HyperVHostsTable({
	initialHosts,
	initialTotal,
}: HyperVHostsTableProps) {
	const [data, setData] = React.useState<HyperVHost[]>(initialHosts)
	const [totalRows, setTotalRows] = React.useState(initialTotal)
	const [isLoading, setIsLoading] = React.useState(false)
	const [editingHost, setEditingHost] = React.useState<HyperVHost | null>(null)
	const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
	const [showDeleted, setShowDeleted] = React.useState(false)
	const [expandedRowId, setExpandedRowId] = React.useState<number | null>(null)

	const handlePaginationChange = React.useCallback(
		async (pageSize: number, offset: number) => {
			setIsLoading(true)
			try {
				const result = await fetchHyperVHosts(pageSize, offset, showDeleted)
				setData(result.hosts)
				setTotalRows(result.total)
			} catch (error) {
				console.error('Error loading hosts:', error)
			} finally {
				setIsLoading(false)
			}
		},
		[showDeleted]
	)

	const handleRefresh = async () => {
		await handlePaginationChange(10, 0)
	}

	const handleHostUpdated = (updatedHost: HyperVHost) => {
		setData(prev =>
			prev.map(host => (host.id === updatedHost.id ? updatedHost : host))
		)
	}

	const handleEditClick = (host: HyperVHost) => {
		if (host.status.status === 'DELETED') return
		setEditingHost(host)
		setIsEditDialogOpen(true)
	}

	const handleDeleteClick = async (host: HyperVHost) => {
		if (host.status.status === 'DELETED') return

		if (!confirm(`Вы уверены, что хотите удалить хост "${host.host_fqdn}"?`)) {
			return
		}

		try {
			await deleteHyperVHost(host.id)
			await handleRefresh()
		} catch (error) {
			console.error('Error deleting host:', error)
			alert(
				error instanceof Error ? error.message : 'Ошибка при удалении хоста'
			)
		}
	}

	const handleStatusChange = async (
		host: HyperVHost,
		newStatusKey: HyperVHostStatusKey
	) => {
		try {
			// Логируем для отладки
			console.log('Current host status:', host.status)
			console.log('Trying to change to:', newStatusKey)
			console.log('Status ID map:', HYPERVHOST_STATUS_ID_MAP)

			const statusId = HYPERVHOST_STATUS_ID_MAP[newStatusKey]
			console.log('Sending status_id:', statusId)

			const updatedHost = await updateHyperVHostStatus(host.id, statusId)
			console.log('Updated host status:', updatedHost.status)

			handleHostUpdated(updatedHost)
		} catch (error) {
			console.error('Error changing status:', error)
			alert(
				error instanceof Error ? error.message : 'Ошибка при изменении статуса'
			)
		}
	}

	const hyperVColumns: ColumnDef<HyperVHost>[] = [
		{
			id: 'expand',
			header: () => <div className='w-8' />,
			cell: ({ row }) => (
				<Button
					variant='ghost'
					size='icon'
					className='h-8 w-8 p-0'
					onClick={() =>
						setExpandedRowId(
							expandedRowId === row.original.id ? null : row.original.id
						)
					}
				>
					<ChevronDownIcon
						className={`h-4 w-4 transition-transform duration-200 ${
							expandedRowId === row.original.id ? 'rotate-180' : ''
						}`}
					/>
				</Button>
			),
			enableSorting: false,
			enableHiding: false,
		},
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
			accessorKey: 'host_fqdn',
			header: 'Хост',
			cell: ({ row }) => (
				<span className='font-medium'>{row.original.host_fqdn}</span>
			),
			enableHiding: false,
		},
		{
			accessorKey: 'location',
			header: 'IP адрес',
			cell: ({ row }) => (
				<div className='font-mono text-sm'>{row.original.location}</div>
			),
			enableHiding: false,
		},
		{
			accessorKey: 'winrm_port',
			header: 'WinRM порт',
			cell: ({ row }) => (
				<span className='font-mono text-sm'>{row.original.winrm_port}</span>
			),
			enableHiding: true,
		},
		{
			accessorKey: 'https',
			header: 'HTTPS',
			cell: ({ row }) => (
				<Badge variant={row.original.https ? 'default' : 'secondary'}>
					{row.original.https ? 'Да' : 'Нет'}
				</Badge>
			),
			enableHiding: true,
		},
		{
			accessorKey: 'description',
			header: 'Описание',
			cell: ({ row }) => (
				<span className='text-sm text-muted-foreground'>
					{row.original.description || '-'}
				</span>
			),
			enableHiding: true,
		},
		{
			accessorKey: 'status',
			header: 'Статус',
			cell: ({ row }) => {
				const currentStatus = row.original.status.status
				const statusConfig = HYPERVHOST_STATUS[currentStatus]
				const isDeleted = currentStatus === 'DELETED'

				if (isDeleted) {
					return (
						<Badge variant={statusConfig.variant}>
							<div className={`w-2 h-2 rounded-full animate-pulse`} />
							<span className='text-xs'>{statusConfig.label}</span>
						</Badge>
					)
				}

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className='outline-none'>
								<Badge
									variant={statusConfig.variant}
									className='cursor-pointer'
								>
									<div className={`w-2 h-2 rounded-full animate-pulse`} />
									<span className='text-xs'>{statusConfig.label}</span>
								</Badge>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='start'>
							{Object.entries(HYPERVHOST_STATUS)
								.filter(([key]) => key !== 'DELETED')
								.map(([key, config]) => (
									<DropdownMenuItem
										key={key}
										onClick={() =>
											handleStatusChange(
												row.original,
												key as HyperVHostStatusKey
											)
										}
										disabled={currentStatus === key}
									>
										<Badge variant={config.variant} className='w-full'>
											<div className={`w-2 h-2 rounded-full animate-pulse`} />
											<span className='text-xs'>{config.label}</span>
										</Badge>
									</DropdownMenuItem>
								))}
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
			enableHiding: true,
		},
		{
			accessorKey: 'total_cpu',
			header: 'CPU всего',
			cell: ({ row }) => (
				<div className='text-right font-medium'>{row.original.total_cpu}</div>
			),
			enableHiding: true,
		},
		{
			accessorKey: 'free_cpu',
			header: 'CPU свободно',
			cell: ({ row }) => (
				<div className='text-right font-medium'>{row.original.free_cpu}</div>
			),
			enableHiding: true,
		},
		{
			id: 'cpu_usage',
			header: 'CPU использовано',
			cell: ({ row }) => {
				const usage =
					((row.original.total_cpu - row.original.free_cpu) /
						row.original.total_cpu) *
					100

				return <div className='text-right'>{Math.round(usage)}%</div>
			},
			enableHiding: true,
		},
		{
			accessorKey: 'total_ram',
			header: 'RAM всего (GB)',
			cell: ({ row }) => (
				<div className='text-right font-medium'>
					{(row.original.total_ram / 1024).toFixed(2)}
				</div>
			),
			enableHiding: true,
		},
		{
			accessorKey: 'free_ram',
			header: 'RAM свободно (GB)',
			cell: ({ row }) => (
				<div className='text-right font-medium'>
					{(row.original.free_ram / 1024).toFixed(2)}
				</div>
			),
			enableHiding: true,
		},
		{
			id: 'memory_usage',
			header: 'RAM использовано',
			cell: ({ row }) => {
				const usage =
					((row.original.total_ram - row.original.free_ram) /
						row.original.total_ram) *
					100

				return <div className='text-right'>{Math.round(usage)}%</div>
			},
			enableHiding: true,
		},
		{
			accessorKey: 'total_storage',
			header: 'Хранилище всего (GB)',
			cell: ({ row }) => (
				<div className='text-right font-medium'>
					{row.original.total_storage.toFixed(2)}
				</div>
			),
			enableHiding: true,
		},
		{
			accessorKey: 'free_storage',
			header: 'Хранилище свободно (GB)',
			cell: ({ row }) => (
				<div className='text-right font-medium'>
					{row.original.free_storage.toFixed(2)}
				</div>
			),
			enableHiding: true,
		},
		{
			id: 'storage_usage',
			header: 'Хранилище использовано',
			cell: ({ row }) => {
				const usage =
					((row.original.total_storage - row.original.free_storage) /
						row.original.total_storage) *
					100

				return <div className='text-right'>{Math.round(usage)}%</div>
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
								onClick={() => handleEditClick(row.original)}
								disabled={isDeleted}
							>
								Редактировать
							</DropdownMenuItem>
							<DropdownMenuSeparator />
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
		<>
			<DataTable
				columns={hyperVColumns}
				data={data}
				totalRows={totalRows}
				onPaginationChange={handlePaginationChange}
				isLoading={isLoading}
				searchPlaceholder='Поиск по имени хоста или IP'
				searchable
				emptyMessage='Хосты не найдены'
				expandedRowId={expandedRowId}
				renderExpandedRow={row => (
					<div className='border-t'>
						<div className='px-4 py-3 bg-muted/50'>
							<h3 className='text-sm font-semibold mb-1'>
								История аудита: {row.original.host_fqdn}
							</h3>
							<p className='text-xs text-muted-foreground'>
								Все действия и изменения для данного хоста
							</p>
						</div>
						<HyperVHostAuditLogs hostId={row.original.id} />
					</div>
				)}
				customActions={
					<>
						<div className='flex items-center gap-2 px-3 h-10 border rounded-xl'>
							<Switch
								id='show-deleted'
								checked={showDeleted}
								onCheckedChange={checked => {
									setShowDeleted(checked)
									handlePaginationChange(10, 0)
								}}
							/>
							<Label htmlFor='show-deleted' className='cursor-pointer'>
								Показать удаленные
							</Label>
						</div>
						<CreateHyperVHostDialog onHostCreated={handleRefresh} />
					</>
				}
			/>
			{editingHost && (
				<EditHyperVHostDialog
					host={editingHost}
					open={isEditDialogOpen}
					onOpenChange={setIsEditDialogOpen}
					onHostUpdated={handleHostUpdated}
				/>
			)}
		</>
	)
}

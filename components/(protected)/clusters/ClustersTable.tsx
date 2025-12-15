'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Cluster } from '@/types/cluster'
import { CLUSTER_STATUS } from '@/constants/clusterStatuses'
import { useRouter } from 'next/navigation'
import CreateClusterDialog from './CreateClusterDialog'
import { fetchClusters } from '@/lib/actions/clusters'
import { DataTable } from '@/components/ui/data-table'

const columns: ColumnDef<Cluster>[] = [
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
		accessorKey: 'name',
		header: 'Название',
		cell: ({ row }) => <div className='font-medium'>{row.original.name}</div>,
		enableHiding: false,
	},
	{
		accessorKey: 'pg_version',
		header: 'Версия',
		cell: ({ row }) => (
			<Badge variant='outline' className='text-muted-foreground px-1.5'>
				{row.original.pg_version}
			</Badge>
		),
	},
	{
		accessorKey: 'status',
		header: 'Статус',
		cell: ({ row }) => {
			const statusConfig = CLUSTER_STATUS[row.original.status.status]
			return (
				<Badge variant={statusConfig.variant}>
					<div className={`w-2 h-2 rounded-full animate-pulse`} />
					<span className='text-xs'>{statusConfig.label}</span>
				</Badge>
			)
		},
	},
	{
		accessorKey: 'cpu',
		header: () => <div className='text-right'>CPU</div>,
		cell: ({ row }) => (
			<div className='text-right'>{row.original.cpu} ядер</div>
		),
	},
	{
		accessorKey: 'ram_mb',
		header: () => <div className='text-right'>RAM</div>,
		cell: ({ row }) => (
			<div className='text-right'>{row.original.ram_mb} МБ</div>
		),
	},
	{
		accessorKey: 'storage_gb',
		header: () => <div className='text-right'>Storage</div>,
		cell: ({ row }) => (
			<div className='text-right'>{row.original.storage_gb} ГБ</div>
		),
	},
	{
		id: 'actions',
		cell: () => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
						size='icon'
					>
						<EllipsisVerticalIcon className='w-4 h-4' />
						<span className='sr-only'>Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-32'>
					<DropdownMenuItem>Открыть</DropdownMenuItem>
					<DropdownMenuItem>Редактировать</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem variant='destructive'>Удалить</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
]

interface ClustersTableProps {
	initialClusters: Cluster[]
	initialTotal: number
}

export default function ClustersTable({
	initialClusters,
	initialTotal,
}: ClustersTableProps) {
	const router = useRouter()
	const [data, setData] = React.useState<Cluster[]>(initialClusters)
	const [totalRows, setTotalRows] = React.useState(initialTotal)
	const [isLoading, setIsLoading] = React.useState(false)

	const handlePaginationChange = React.useCallback(
		async (pageSize: number, offset: number) => {
			setIsLoading(true)
			try {
				const result = await fetchClusters(pageSize, offset)
				setData(result.clusters)
				setTotalRows(result.total)
			} catch (error) {
				console.error('Error loading clusters:', error)
			} finally {
				setIsLoading(false)
			}
		},
		[]
	)

	const handleRefresh = async () => {
		await handlePaginationChange(10, 0)
	}

	return (
		<DataTable
			columns={columns}
			data={data}
			totalRows={totalRows}
			onPaginationChange={handlePaginationChange}
			isLoading={isLoading}
			searchPlaceholder='Поиск по кластерам'
			onRowClick={row => router.push(`/clusters/${row.original.id}`)}
			customActions={<CreateClusterDialog onClusterCreated={handleRefresh} />}
		/>
	)
}

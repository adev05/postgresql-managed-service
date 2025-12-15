'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Server } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { fetchHyperVHosts } from '@/lib/actions/hyperv-hosts'
import { HyperVHost } from '@/types/hyperv-host'
import { HYPERVHOST_STATUS } from '@/constants/hyperVHostStatuses'

const hyperVColumns: ColumnDef<HyperVHost>[] = [
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
			<div className='flex items-center gap-2'>
				<Server className='w-4 h-4 text-muted-foreground' />
				<span className='font-medium'>{row.original.host_fqdn}</span>
			</div>
		),
	},
	{
		accessorKey: 'location',
		header: 'IP адрес',
		cell: ({ row }) => (
			<div className='font-mono text-sm'>{row.original.location}</div>
		),
	},
	{
		accessorKey: 'status',
		header: 'Статус',
		cell: ({ row }) => {
			const statusConfig = HYPERVHOST_STATUS[row.original.status.status]
			return (
				<Badge variant={statusConfig.variant}>
					<div className={`w-2 h-2 rounded-full animate-pulse`} />
					<span className='text-xs'>{statusConfig.label}</span>
				</Badge>
			)
		},
	},
	{
		id: 'vm_count',
		header: () => <div className='text-right'>Виртуальные машины</div>,
		cell: ({ row }) => {
			const usedCpu = row.original.total_cpu - row.original.free_cpu
			return <div className='text-right font-medium'>{usedCpu} ВМ</div>
		},
	},
	{
		id: 'cpu_usage',
		header: () => <div className='text-right'>CPU</div>,
		cell: ({ row }) => {
			const usage =
				((row.original.total_cpu - row.original.free_cpu) /
					row.original.total_cpu) *
				100

			return <div className='text-right'>{Math.round(usage)}%</div>
		},
	},
	{
		id: 'memory_usage',
		header: () => <div className='text-right'>RAM</div>,
		cell: ({ row }) => {
			const usage =
				((row.original.total_ram - row.original.free_ram) /
					row.original.total_ram) *
				100

			return <div className='text-right'>{Math.round(usage)}%</div>
		},
	},
]

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

	const handlePaginationChange = React.useCallback(
		async (pageSize: number, offset: number) => {
			setIsLoading(true)
			try {
				const result = await fetchHyperVHosts(pageSize, offset)
				setData(result.hosts)
				setTotalRows(result.total)
			} catch (error) {
				console.error('Error loading hosts:', error)
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
			columns={hyperVColumns}
			data={data}
			totalRows={totalRows}
			onPaginationChange={handlePaginationChange}
			isLoading={isLoading}
			searchPlaceholder='Поиск по имени хоста или IP'
			searchable
			emptyMessage='Хосты не найдены'
			customActions={
				<Button onClick={handleRefresh} variant='outline'>
					Обновить
				</Button>
			}
		/>
	)
}

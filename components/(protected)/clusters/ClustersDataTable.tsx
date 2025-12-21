// 'use client'

// import * as React from 'react'
// import {
// 	ColumnDef,
// 	ColumnFiltersState,
// 	flexRender,
// 	getCoreRowModel,
// 	getFacetedRowModel,
// 	getFacetedUniqueValues,
// 	getFilteredRowModel,
// 	getSortedRowModel,
// 	SortingState,
// 	useReactTable,
// 	VisibilityState,
// } from '@tanstack/react-table'
// import {
// 	ChevronLeftIcon,
// 	ChevronRightIcon,
// 	MagnifyingGlassIcon,
// } from '@heroicons/react/24/outline'
// import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Checkbox } from '@/components/ui/checkbox'
// import {
// 	DropdownMenu,
// 	DropdownMenuCheckboxItem,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuSeparator,
// 	DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from '@/components/ui/select'
// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableHead,
// 	TableHeader,
// 	TableRow,
// } from '@/components/ui/table'
// import { Cluster } from '@/types/cluster'
// import { CLUSTER_STATUS } from '@/constants/clusterStatuses'
// import { useRouter } from 'next/navigation'
// import CreateClusterDialog from './CreateClusterDialog'
// import { ChevronDown, Columns2 } from 'lucide-react'
// import { fetchClusters } from '@/lib/actions/clusters'

// const columns: ColumnDef<Cluster>[] = [
// 	{
// 		id: 'select',
// 		header: ({ table }) => (
// 			<div className='flex items-center justify-center'>
// 				<Checkbox
// 					checked={
// 						table.getIsAllPageRowsSelected() ||
// 						(table.getIsSomePageRowsSelected() && 'indeterminate')
// 					}
// 					onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
// 					aria-label='Select all'
// 				/>
// 			</div>
// 		),
// 		cell: ({ row }) => (
// 			<div className='flex items-center justify-center'>
// 				<Checkbox
// 					checked={row.getIsSelected()}
// 					onCheckedChange={value => row.toggleSelected(!!value)}
// 					aria-label='Select row'
// 				/>
// 			</div>
// 		),
// 		enableSorting: false,
// 		enableHiding: false,
// 	},
// 	{
// 		accessorKey: 'name',
// 		header: 'Название',
// 		cell: ({ row }) => {
// 			return <div className='font-medium'>{row.original.name}</div>
// 		},
// 		enableHiding: false,
// 	},
// 	{
// 		accessorKey: 'pg_version',
// 		header: 'Версия',
// 		cell: ({ row }) => (
// 			<Badge variant='outline' className='text-muted-foreground px-1.5'>
// 				{row.original.pg_version}
// 			</Badge>
// 		),
// 	},
// 	{
// 		accessorKey: 'status',
// 		header: 'Статус',
// 		cell: ({ row }) => {
// 			const statusConfig = CLUSTER_STATUS[row.original.status.status]
// 			return (
// 				<Badge variant={statusConfig.variant}>
// 					<div className={`w-2 h-2 rounded-full animate-pulse`} />
// 					<span className='text-xs'>{statusConfig.label}</span>
// 				</Badge>
// 			)
// 		},
// 	},
// 	{
// 		accessorKey: 'cpu',
// 		header: () => <div className='text-right'>CPU</div>,
// 		cell: ({ row }) => (
// 			<div className='text-right'>{row.original.cpu} ядер</div>
// 		),
// 	},
// 	{
// 		accessorKey: 'ram_mb',
// 		header: () => <div className='text-right'>RAM</div>,
// 		cell: ({ row }) => (
// 			<div className='text-right'>{row.original.ram_mb} МБ</div>
// 		),
// 	},
// 	{
// 		accessorKey: 'storage_gb',
// 		header: () => <div className='text-right'>Storage</div>,
// 		cell: ({ row }) => (
// 			<div className='text-right'>{row.original.storage_gb} ГБ</div>
// 		),
// 	},
// 	{
// 		id: 'actions',
// 		cell: () => (
// 			<DropdownMenu>
// 				<DropdownMenuTrigger asChild>
// 					<Button
// 						variant='ghost'
// 						className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
// 						size='icon'
// 					>
// 						<EllipsisVerticalIcon className='w-4 h-4' />
// 						<span className='sr-only'>Open menu</span>
// 					</Button>
// 				</DropdownMenuTrigger>
// 				<DropdownMenuContent align='end' className='w-32'>
// 					<DropdownMenuItem>Открыть</DropdownMenuItem>
// 					<DropdownMenuItem>Редактировать</DropdownMenuItem>
// 					<DropdownMenuSeparator />
// 					<DropdownMenuItem variant='destructive'>Удалить</DropdownMenuItem>
// 				</DropdownMenuContent>
// 			</DropdownMenu>
// 		),
// 	},
// ]

// interface ClustersDataTableProps {
// 	clusters: Cluster[]
// 	total: number
// }

// export default function ClustersDataTable({
// 	clusters,
// 	total,
// }: ClustersDataTableProps) {
// 	const router = useRouter()
// 	const [data, setData] = React.useState<Cluster[]>(clusters)
// 	const [totalRows, setTotalRows] = React.useState(total)
// 	const [rowSelection, setRowSelection] = React.useState({})
// 	const [columnVisibility, setColumnVisibility] =
// 		React.useState<VisibilityState>({})
// 	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
// 		[]
// 	)
// 	const [sorting, setSorting] = React.useState<SortingState>([])
// 	const [pagination, setPagination] = React.useState({
// 		pageIndex: 0,
// 		pageSize: 10,
// 	})
// 	const [globalFilter, setGlobalFilter] = React.useState('')
// 	const [isLoading, setIsLoading] = React.useState(false)

// 	// Вычисляем количество страниц на основе total с сервера
// 	const pageCount = Math.ceil(totalRows / pagination.pageSize)

// 	const table = useReactTable({
// 		data,
// 		columns,
// 		pageCount, // Передаем количество страниц
// 		state: {
// 			sorting,
// 			columnVisibility,
// 			rowSelection,
// 			columnFilters,
// 			pagination,
// 			globalFilter,
// 		},
// 		enableRowSelection: true,
// 		onRowSelectionChange: setRowSelection,
// 		onSortingChange: setSorting,
// 		onColumnFiltersChange: setColumnFilters,
// 		onColumnVisibilityChange: setColumnVisibility,
// 		onPaginationChange: setPagination,
// 		onGlobalFilterChange: setGlobalFilter,
// 		getCoreRowModel: getCoreRowModel(),
// 		getFilteredRowModel: getFilteredRowModel(),
// 		getSortedRowModel: getSortedRowModel(),
// 		getFacetedRowModel: getFacetedRowModel(),
// 		getFacetedUniqueValues: getFacetedUniqueValues(),
// 		// Ключевые настройки для серверной пагинации
// 		manualPagination: true, // Отключаем клиентскую пагинацию
// 		manualFiltering: false, // Можно включить серверную фильтрацию позже
// 		manualSorting: false, // Можно включить серверную сортировку позже
// 	})

// 	// Загрузка данных при изменении пагинации
// 	React.useEffect(() => {
// 		const loadClusters = async () => {
// 			setIsLoading(true)
// 			try {
// 				const result = await fetchClusters(
// 					pagination.pageSize,
// 					pagination.pageIndex * pagination.pageSize
// 				)
// 				setData(result.clusters)
// 				setTotalRows(result.total)
// 			} catch (error) {
// 				console.error('Error loading clusters:', error)
// 			} finally {
// 				setIsLoading(false)
// 			}
// 		}

// 		loadClusters()
// 	}, [pagination.pageIndex, pagination.pageSize])

// 	const refreshClusters = React.useCallback(async () => {
// 		setIsLoading(true)
// 		try {
// 			const result = await fetchClusters(
// 				pagination.pageSize,
// 				pagination.pageIndex * pagination.pageSize
// 			)
// 			setData(result.clusters)
// 			setTotalRows(result.total)
// 		} catch (error) {
// 			console.error('Error loading clusters:', error)
// 		} finally {
// 			setIsLoading(false)
// 		}
// 	}, [pagination.pageSize, pagination.pageIndex])

// 	return (
// 		<div className='w-full flex flex-col gap-4'>
// 			{/* Верхняя панель управления */}
// 			<div className='flex items-center gap-4 flex-wrap'>
// 				<div className='relative w-full max-w-sm'>
// 					<MagnifyingGlassIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none' />
// 					<Input
// 						placeholder='Поиск по кластерам'
// 						className='pl-10'
// 						value={globalFilter ?? ''}
// 						onChange={e => setGlobalFilter(e.target.value)}
// 					/>
// 				</div>
// 				<div className='flex items-center gap-3 ml-auto'>
// 					<DropdownMenu>
// 						<DropdownMenuTrigger asChild>
// 							<Button variant='outline'>
// 								<Columns2 />
// 								<span className='hidden lg:inline'>Колонки</span>
// 								<ChevronDown />
// 							</Button>
// 						</DropdownMenuTrigger>
// 						<DropdownMenuContent align='end' className='w-56'>
// 							{table
// 								.getAllColumns()
// 								.filter(
// 									column =>
// 										typeof column.accessorFn !== 'undefined' &&
// 										column.getCanHide()
// 								)
// 								.map(column => {
// 									return (
// 										<DropdownMenuCheckboxItem
// 											key={column.id}
// 											className='capitalize'
// 											checked={column.getIsVisible()}
// 											onCheckedChange={value =>
// 												column.toggleVisibility(!!value)
// 											}
// 										>
// 											{column.id}
// 										</DropdownMenuCheckboxItem>
// 									)
// 								})}
// 						</DropdownMenuContent>
// 					</DropdownMenu>
// 					<CreateClusterDialog onClusterCreated={refreshClusters} />
// 				</div>
// 			</div>

// 			<div className='overflow-hidden rounded-lg border'>
// 				<Table>
// 					<TableHeader className='bg-muted sticky top-0 z-10'>
// 						{table.getHeaderGroups().map(headerGroup => (
// 							<TableRow key={headerGroup.id}>
// 								{headerGroup.headers.map(header => {
// 									return (
// 										<TableHead key={header.id} colSpan={header.colSpan}>
// 											{header.isPlaceholder
// 												? null
// 												: flexRender(
// 														header.column.columnDef.header,
// 														header.getContext()
// 												  )}
// 										</TableHead>
// 									)
// 								})}
// 							</TableRow>
// 						))}
// 					</TableHeader>
// 					<TableBody>
// 						{isLoading ? (
// 							<TableRow>
// 								<TableCell
// 									colSpan={columns.length}
// 									className='h-24 text-center'
// 								>
// 									Загрузка...
// 								</TableCell>
// 							</TableRow>
// 						) : table.getRowModel().rows?.length ? (
// 							table.getRowModel().rows.map(row => (
// 								<TableRow
// 									key={row.id}
// 									data-state={row.getIsSelected() && 'selected'}
// 									className='cursor-pointer'
// 									onClick={() => router.push(`/clusters/${row.original.id}`)}
// 								>
// 									{row.getVisibleCells().map(cell => (
// 										<TableCell
// 											key={cell.id}
// 											onClick={e => {
// 												if (
// 													cell.column.id === 'select' ||
// 													cell.column.id === 'actions'
// 												) {
// 													e.stopPropagation()
// 												}
// 											}}
// 										>
// 											{flexRender(
// 												cell.column.columnDef.cell,
// 												cell.getContext()
// 											)}
// 										</TableCell>
// 									))}
// 								</TableRow>
// 							))
// 						) : (
// 							<TableRow>
// 								<TableCell
// 									colSpan={columns.length}
// 									className='h-24 text-center'
// 								>
// 									Нет результатов.
// 								</TableCell>
// 							</TableRow>
// 						)}
// 					</TableBody>
// 				</Table>
// 			</div>

// 			{/* Пагинация */}
// 			<div className='flex items-center justify-between px-4'>
// 				<div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
// 					{table.getFilteredSelectedRowModel().rows.length} из {data.length}{' '}
// 					строк на странице выбрано.
// 				</div>
// 				<div className='flex w-full items-center gap-8 lg:w-fit'>
// 					<div className='hidden items-center gap-2 lg:flex'>
// 						<Label htmlFor='rows-per-page' className='text-sm font-medium'>
// 							Строк на странице
// 						</Label>
// 						<Select
// 							value={`${table.getState().pagination.pageSize}`}
// 							onValueChange={value => {
// 								table.setPageSize(Number(value))
// 							}}
// 						>
// 							<SelectTrigger className='w-20' id='rows-per-page'>
// 								<SelectValue
// 									placeholder={table.getState().pagination.pageSize}
// 								/>
// 							</SelectTrigger>
// 							<SelectContent side='top'>
// 								{[10, 20, 30, 40, 50].map(pageSize => (
// 									<SelectItem key={pageSize} value={`${pageSize}`}>
// 										{pageSize}
// 									</SelectItem>
// 								))}
// 							</SelectContent>
// 						</Select>
// 					</div>
// 					<div className='flex w-fit items-center justify-center text-sm font-medium'>
// 						Страница {table.getState().pagination.pageIndex + 1} из{' '}
// 						{pageCount || 1}
// 					</div>
// 					<div className='ml-auto flex items-center gap-2 lg:ml-0'>
// 						<Button
// 							variant='outline'
// 							className='size-8'
// 							size='icon'
// 							onClick={() => table.previousPage()}
// 							disabled={!table.getCanPreviousPage() || isLoading}
// 						>
// 							<span className='sr-only'>Предыдущая страница</span>
// 							<ChevronLeftIcon className='w-4 h-4' />
// 						</Button>
// 						<Button
// 							variant='outline'
// 							className='size-8'
// 							size='icon'
// 							onClick={() => table.nextPage()}
// 							disabled={!table.getCanNextPage() || isLoading}
// 						>
// 							<span className='sr-only'>Следующая страница</span>
// 							<ChevronRightIcon className='w-4 h-4' />
// 						</Button>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

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
// import { Button } from '@/components/ui/button'
// import {
// 	DropdownMenu,
// 	DropdownMenuCheckboxItem,
// 	DropdownMenuContent,
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
// import { ChevronDown, Columns2 } from 'lucide-react'

// interface DataTableProps<TData> {
// 	columns: ColumnDef<TData>[]
// 	data: TData[]
// 	total: number
// 	filterPlaceholder?: string
// 	filterColumnId?: string
// }

// export function AdminDataTable<TData>({
// 	columns,
// 	data,
// 	total = 1,
// 	filterPlaceholder = 'Поиск',
// 	filterColumnId = 'name',
// }: DataTableProps<TData>) {
// 	const [sorting, setSorting] = React.useState<SortingState>([])
// 	const [totalRows, setTotalRows] = React.useState(total)
// 	const [rowSelection, setRowSelection] = React.useState({})
// 	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
// 		[]
// 	)
// 	const [columnVisibility, setColumnVisibility] =
// 		React.useState<VisibilityState>({})
// 	const [globalFilter, setGlobalFilter] = React.useState('')
// 	const [pagination, setPagination] = React.useState({
// 		pageIndex: 0,
// 		pageSize: 10,
// 	})
// 	const [isLoading, setIsLoading] = React.useState(false)

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

// 	return (
// 		<div className='w-full flex flex-col gap-4'>
// 			{/* Верхняя панель управления */}
// 			<div className='flex items-center gap-4 flex-wrap'>
// 				<div className='relative w-full max-w-sm'>
// 					<MagnifyingGlassIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none' />
// 					<Input
// 						placeholder={filterPlaceholder}
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
// 									// onClick={() => router.push(`/clusters/${row.original.id}`)}
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

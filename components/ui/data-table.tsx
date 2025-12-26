'use client'

import * as React from 'react'
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
	Row,
} from '@tanstack/react-table'
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	MagnifyingGlassIcon,
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
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
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Columns2 } from 'lucide-react'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	totalRows: number
	onPaginationChange: (pageSize: number, offset: number) => Promise<void>
	isLoading?: boolean
	searchPlaceholder?: string
	searchable?: boolean
	onRowClick?: (row: Row<TData>) => void
	customActions?: React.ReactNode
	pageSizeOptions?: number[]
	initialPageSize?: number
	className?: string
	emptyMessage?: string
	renderExpandedRow?: (row: Row<TData>) => React.ReactNode
	expandedRowId?: any
}

export function DataTable<TData, TValue>({
	columns,
	data,
	totalRows,
	onPaginationChange,
	isLoading = false,
	searchPlaceholder = 'Поиск...',
	searchable = true,
	onRowClick,
	customActions,
	pageSizeOptions = [10, 20, 30, 40, 50],
	initialPageSize = 10,
	className = '',
	emptyMessage = 'Нет результатов.',
	renderExpandedRow,
	expandedRowId,
}: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = React.useState({})
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: initialPageSize,
	})
	const [globalFilter, setGlobalFilter] = React.useState('')

	const pageCount = Math.ceil(totalRows / pagination.pageSize)

	const table = useReactTable({
		data,
		columns,
		pageCount,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
			globalFilter,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		manualPagination: true,
		manualFiltering: false,
		manualSorting: false,
	})

	React.useEffect(() => {
		onPaginationChange(
			pagination.pageSize,
			pagination.pageIndex * pagination.pageSize
		)
	}, [pagination.pageIndex, pagination.pageSize, onPaginationChange])

	const goToPage = (pageNumber: number) => {
		table.setPageIndex(pageNumber)
	}

	const getPageNumbers = () => {
		const pages: (number | string)[] = []
		const currentPage = pagination.pageIndex
		const totalPages = pageCount

		if (totalPages <= 7) {
			for (let i = 0; i < totalPages; i++) {
				pages.push(i)
			}
		} else {
			pages.push(0)

			if (currentPage <= 3) {
				for (let i = 1; i <= 5; i++) {
					pages.push(i)
				}
				pages.push('...')
				pages.push(totalPages - 1)
			} else if (currentPage >= totalPages - 4) {
				pages.push('...')
				for (let i = totalPages - 6; i < totalPages - 1; i++) {
					pages.push(i)
				}
				pages.push(totalPages - 1)
			} else {
				pages.push('...')
				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					pages.push(i)
				}
				pages.push('...')
				pages.push(totalPages - 1)
			}
		}

		return pages
	}

	return (
		<div className={`w-full flex flex-col gap-4 ${className}`}>
			{/* Верхняя панель */}
			{(searchable || customActions) && (
				<div className='flex items-center gap-4 flex-wrap'>
					{searchable && (
						<div className='relative w-full max-w-sm'>
							<MagnifyingGlassIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none' />
							<Input
								placeholder={searchPlaceholder}
								className='pl-10'
								value={globalFilter ?? ''}
								onChange={e => setGlobalFilter(e.target.value)}
							/>
						</div>
					)}
					<div className='flex items-center gap-3 ml-auto'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='outline'>
									<Columns2 />
									<span className='hidden lg:inline'>Колонки</span>
									<ChevronDown />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end' className='w-56'>
								{table
									.getAllColumns()
									.filter(column => column.getCanHide())
									.map(column => {
										const header =
											typeof column.columnDef.header === 'string'
												? column.columnDef.header
												: column.id
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												checked={column.getIsVisible()}
												onCheckedChange={value =>
													column.toggleVisibility(!!value)
												}
											>
												{header}
											</DropdownMenuCheckboxItem>
										)
									})}
							</DropdownMenuContent>
						</DropdownMenu>
						{customActions}
					</div>
				</div>
			)}

			{/* Таблица */}
			<div className='overflow-hidden rounded-lg border'>
				<Table>
					<TableHeader className='bg-muted sticky top-0 z-10'>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									Загрузка...
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<React.Fragment key={row.id}>
									<TableRow
										data-state={row.getIsSelected() && 'selected'}
										className={onRowClick ? 'cursor-pointer' : ''}
										onClick={() => onRowClick?.(row)}
									>
										{row.getVisibleCells().map(cell => (
											<TableCell
												key={cell.id}
												onClick={e => {
													if (
														cell.column.id === 'select' ||
														cell.column.id === 'actions' ||
														cell.column.id === 'expand'
													) {
														e.stopPropagation()
													}
												}}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
									{renderExpandedRow &&
										expandedRowId === (row.original as any).id && (
											<TableRow>
												<TableCell
													colSpan={columns.length}
													className='p-0 bg-muted/30'
												>
													<div className='animate-in slide-in-from-top-2 duration-200'>
														{renderExpandedRow(row)}
													</div>
												</TableCell>
											</TableRow>
										)}
								</React.Fragment>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									{emptyMessage}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Пагинация */}
			<div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-4'>
				<div className='text-muted-foreground text-sm'>
					<span className='hidden lg:inline'>
						{table.getFilteredSelectedRowModel().rows.length} из {data.length}{' '}
						строк на странице выбрано.
					</span>
					<span className='lg:hidden'>
						{table.getFilteredSelectedRowModel().rows.length} выбрано
					</span>
				</div>

				<div className='flex flex-col items-center gap-4 lg:flex-row'>
					<div className='flex items-center gap-2'>
						<Label
							htmlFor='rows-per-page'
							className='text-sm font-medium whitespace-nowrap'
						>
							Строк на странице
						</Label>
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={value => {
								table.setPageSize(Number(value))
							}}
						>
							<SelectTrigger className='w-20' id='rows-per-page'>
								<SelectValue
									placeholder={table.getState().pagination.pageSize}
								/>
							</SelectTrigger>
							<SelectContent side='top'>
								{pageSizeOptions.map(pageSize => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='flex items-center gap-2'>
						<Button
							variant='outline'
							className='size-8 hidden lg:flex'
							size='icon'
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage() || isLoading}
						>
							<span className='sr-only'>Первая страница</span>
							<ChevronDoubleLeftIcon className='w-4 h-4' />
						</Button>

						<Button
							variant='outline'
							className='size-8'
							size='icon'
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage() || isLoading}
						>
							<span className='sr-only'>Предыдущая страница</span>
							<ChevronLeftIcon className='w-4 h-4' />
						</Button>

						<div className='hidden lg:flex items-center gap-1'>
							{getPageNumbers().map((page, index) =>
								page === '...' ? (
									<span key={`ellipsis-${index}`} className='px-2'>
										...
									</span>
								) : (
									<Button
										key={page}
										variant={
											pagination.pageIndex === page ? 'default' : 'outline'
										}
										className='size-8'
										size='icon'
										onClick={() => goToPage(page as number)}
										disabled={isLoading}
									>
										{(page as number) + 1}
									</Button>
								)
							)}
						</div>

						<div className='lg:hidden text-sm font-medium px-4'>
							{pagination.pageIndex + 1} / {pageCount}
						</div>

						<Button
							variant='outline'
							className='size-8'
							size='icon'
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage() || isLoading}
						>
							<span className='sr-only'>Следующая страница</span>
							<ChevronRightIcon className='w-4 h-4' />
						</Button>

						<Button
							variant='outline'
							className='size-8 hidden lg:flex'
							size='icon'
							onClick={() => table.setPageIndex(pageCount - 1)}
							disabled={!table.getCanNextPage() || isLoading}
						>
							<span className='sr-only'>Последняя страница</span>
							<ChevronDoubleRightIcon className='w-4 h-4' />
						</Button>
					</div>

					<div className='hidden lg:block text-sm text-muted-foreground whitespace-nowrap'>
						Всего: {totalRows} записей
					</div>
				</div>
			</div>
		</div>
	)
}

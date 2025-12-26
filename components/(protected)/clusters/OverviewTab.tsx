'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Database, Activity, Copy, CheckCircle2, Cable } from 'lucide-react'
import { useState } from 'react'
import { useClusterStore } from '@/stores/cluster-store'
import { CLUSTER_STATUS } from '@/constants/clusterStatuses'
import { Spinner } from '@/components/ui/spinner'

// Данные использования ресурсов (моканные данные для процентов использования)
const mockResourceUsage = {
	cpuPercent: 45,
	memoryPercent: 40,
	storagePercent: 25,
	// activeConnections: 47,
	// maxConnections: 200,
}

// Данные для графиков (последние 6 точек)
const cpuChartData = [
	{ time: '10:00', value: 25 },
	{ time: '10:10', value: 42 },
	{ time: '10:20', value: 38 },
	{ time: '10:30', value: 51 },
	{ time: '10:40', value: 45 },
	{ time: '10:50', value: 43 },
]

const memoryChartData = [
	{ time: '10:00', value: 35 },
	{ time: '10:10', value: 38 },
	{ time: '10:20', value: 42 },
	{ time: '10:30', value: 40 },
	{ time: '10:40', value: 41 },
	{ time: '10:50', value: 40 },
]

// Данные подключения (моканные)
const mockConnectionDetails = {
	database: 'defaultdb',
	user: 'postgres',
	password: 'postgres',
	sslRequired: 'true',
}

const chartConfig = {
	value: {
		label: 'Значение',
		color: 'hsl(var(--primary))',
	},
} satisfies ChartConfig

export default function OverviewTab() {
	const [copied, setCopied] = useState(false)
	const currentCluster = useClusterStore(state => state.currentCluster)

	if (!currentCluster) {
		return (
			<div className='flex items-center justify-center h-64'>
				{/* <p className='text-muted-foreground'>Кластер не выбран</p> */}
				<Spinner />
			</div>
		)
	}

	const cluster = currentCluster

	const handleCopyConnection = () => {
		const connectionString = `postgresql://${mockConnectionDetails.user}:${
			mockConnectionDetails.password
		}@${cluster.endpoint}:${cluster.port}/${
			cluster.db_name || 'defaultdb'
		}?sslmode=require`
		navigator.clipboard.writeText(connectionString)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})
	}

	// Вычисляем используемую память и хранилище на основе процентов
	const usedMemoryGB =
		(cluster.ram_mb / 1024) * (mockResourceUsage.memoryPercent / 100)
	const usedStorageGB =
		cluster.storage_gb * (mockResourceUsage.storagePercent / 100)

	const statusInfo = CLUSTER_STATUS[cluster.status.status]

	return (
		<div className='grid grid-cols-1 xl:grid-cols-3 gap-4 items-start'>
			{/* Основная информация */}
			<Card className='xl:row-span-2 h-full'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						Основная информация
					</CardTitle>
					<CardDescription>Общие сведения о кластере</CardDescription>
					<CardAction>
						<Database className='h-4 w-4 text-muted-foreground' />
					</CardAction>
				</CardHeader>
				<CardContent className='space-y-2'>
					<div className='flex items-center justify-between gap-2'>
						<p className='text-sm text-muted-foreground'>Название</p>
						<div className='flex-1 border-b border-dotted border-border'></div>
						<p className='font-medium'>{cluster.name}</p>
					</div>
					<div className='flex items-center justify-between gap-2'>
						<p className='text-sm text-muted-foreground'>База данных</p>
						<div className='flex-1 border-b border-dotted border-border'></div>
						<p className='font-medium'>{cluster.db_name || '-'}</p>
					</div>
					<div className='flex items-center justify-between gap-2'>
						<p className='text-sm text-muted-foreground'>Версия</p>
						<div className='flex-1 border-b border-dotted border-border'></div>
						<p className='font-medium'>PostgreSQL {cluster.pg_version}</p>
					</div>
					<div className='flex items-center justify-between gap-2'>
						<p className='text-sm text-muted-foreground'>Статус</p>
						<div className='flex-1 border-b border-dotted border-border'></div>
						<Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
					</div>
					<div className='flex items-center justify-between gap-2'>
						<p className='text-sm text-muted-foreground'>Создан</p>
						<div className='flex-1 border-b border-dotted border-border'></div>
						<p className='font-medium'>{formatDate(cluster.created_at)}</p>
					</div>
				</CardContent>
			</Card>

			{/* Использование ресурсов */}
			<Card className='xl:row-span-2 h-full'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						Использование ресурсов
					</CardTitle>
					<CardDescription>Текущая нагрузка на кластер</CardDescription>
					<CardAction>
						<Activity className='h-4 w-4 text-muted-foreground' />
					</CardAction>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div>
						<div className='flex items-center justify-between mb-2'>
							<p className='text-sm font-medium'>CPU</p>
							<p className='text-sm text-muted-foreground'>
								{mockResourceUsage.cpuPercent}% / {cluster.cpu} vCPU
							</p>
						</div>
						<div className='w-full bg-secondary rounded-full h-2'>
							<div
								className='bg-primary h-2 rounded-full transition-all'
								style={{ width: `${mockResourceUsage.cpuPercent}%` }}
							/>
						</div>
					</div>

					<div>
						<div className='flex items-center justify-between mb-2'>
							<p className='text-sm font-medium'>RAM</p>
							<p className='text-sm text-muted-foreground'>
								{usedMemoryGB.toFixed(1)} / {cluster.ram_mb.toFixed(0)} GB
							</p>
						</div>
						<div className='w-full bg-secondary rounded-full h-2'>
							<div
								className='bg-primary h-2 rounded-full transition-all'
								style={{ width: `${mockResourceUsage.memoryPercent}%` }}
							/>
						</div>
					</div>

					<div>
						<div className='flex items-center justify-between mb-2'>
							<p className='text-sm font-medium'>Хранилище</p>
							<p className='text-sm text-muted-foreground'>
								{usedStorageGB.toFixed(1)} / {cluster.storage_gb} GB
							</p>
						</div>
						<div className='w-full bg-secondary rounded-full h-2'>
							<div
								className='bg-primary h-2 rounded-full transition-all'
								style={{ width: `${mockResourceUsage.storagePercent}%` }}
							/>
						</div>
					</div>

					{/* <div>
						<div className='flex items-center justify-between mb-2'>
							<p className='text-sm font-medium'>Подключения</p>
							<p className='text-sm text-muted-foreground'>
								{mockResourceUsage.activeConnections} /{' '}
								{mockResourceUsage.maxConnections}
							</p>
						</div>
						<div className='w-full bg-secondary rounded-full h-2'>
							<div
								className='bg-primary h-2 rounded-full transition-all'
								style={{
									width: `${
										(mockResourceUsage.activeConnections /
											mockResourceUsage.maxConnections) *
										100
									}%`,
								}}
							/>
						</div>
					</div> */}
				</CardContent>
			</Card>

			{/* Подключение к кластеру */}
			<Card className='row-span-1 xl:row-span-3'>
				<CardHeader>
					<CardTitle>Подключение к кластеру</CardTitle>
					<CardDescription>Данные для подключения к PostgreSQL</CardDescription>
					<CardAction>
						<Cable className='h-4 w-4 text-muted-foreground' />
					</CardAction>
				</CardHeader>
				<CardContent className='flex flex-col gap-4'>
					<div className='flex flex-col gap-2'>
						<Label htmlFor='host'>Host</Label>
						<Input
							id='host'
							type='text'
							value={cluster.endpoint || ''}
							readOnly
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<Label htmlFor='port'>Port</Label>
						<Input
							id='port'
							type='text'
							value={cluster.port?.toString() || ''}
							readOnly
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<Label htmlFor='database'>Database</Label>
						<Input
							id='database'
							type='text'
							value={cluster.db_name || ''}
							readOnly
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<Label htmlFor='user'>User</Label>
						<Input
							id='user'
							type='text'
							value={mockConnectionDetails.user}
							readOnly
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<Label htmlFor='password'>Password</Label>
						<Input
							id='password'
							type='password'
							value={mockConnectionDetails.password}
							readOnly
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<Label htmlFor='sslRequired'>SSL Required</Label>
						<Input
							id='sslRequired'
							type='text'
							value={mockConnectionDetails.sslRequired}
							readOnly
						/>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						variant='default'
						className='w-full'
						onClick={handleCopyConnection}
					>
						{copied ? (
							<>
								<CheckCircle2 className='w-4 h-4' />
								Скопировано!
							</>
						) : (
							<>
								<Copy className='w-4 h-4' />
								Скопировать connection string
							</>
						)}
					</Button>
				</CardFooter>
			</Card>

			{/* График CPU */}
			<Card className='xl:col-span-2'>
				<CardHeader>
					<CardTitle>Загруженность процессора</CardTitle>
					<CardDescription>Использование CPU за последний час</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={chartConfig} className='h-64 w-full'>
						<AreaChart accessibilityLayer data={cpuChartData}>
							<CartesianGrid strokeDasharray='3 3' vertical={false} />
							<XAxis
								dataKey='time'
								tickLine={false}
								axisLine={false}
								tick={{ fontSize: 12 }}
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tick={{ fontSize: 12 }}
								tickFormatter={value => `${value}%`}
							/>
							<Area
								dataKey='value'
								type='monotone'
								fill='var(--color-value)'
								fillOpacity={0.2}
								stroke='var(--color-value)'
								strokeWidth={2}
							/>
						</AreaChart>
					</ChartContainer>
				</CardContent>
			</Card>

			{/* График RAM */}
			<Card className='xl:col-span-2'>
				<CardHeader>
					<CardTitle>Использование RAM</CardTitle>
					<CardDescription>
						Использование оперативной памяти за последний час
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={chartConfig} className='h-64 w-full'>
						<AreaChart accessibilityLayer data={memoryChartData}>
							<CartesianGrid strokeDasharray='3 3' vertical={false} />
							<XAxis
								dataKey='time'
								tickLine={false}
								axisLine={false}
								tick={{ fontSize: 12 }}
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tick={{ fontSize: 12 }}
								tickFormatter={value => `${value}%`}
							/>
							<Area
								dataKey='value'
								type='monotone'
								fill='var(--color-value)'
								fillOpacity={0.2}
								stroke='var(--color-value)'
								strokeWidth={2}
							/>
						</AreaChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	)
}

'use client'

import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Area,
	AreaChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Line,
	LineChart,
} from 'recharts'
import { Activity, Database, Network, Clock } from 'lucide-react'
import { useState } from 'react'

// Моканные данные для графиков (последний час с интервалом 5 минут)
const cpuData = [
	{ time: '14:00', value: 23 },
	{ time: '14:05', value: 28 },
	{ time: '14:10', value: 35 },
	{ time: '14:15', value: 42 },
	{ time: '14:20', value: 38 },
	{ time: '14:25', value: 45 },
	{ time: '14:30', value: 51 },
	{ time: '14:35', value: 48 },
	{ time: '14:40', value: 43 },
	{ time: '14:45', value: 39 },
	{ time: '14:50', value: 42 },
	{ time: '14:55', value: 45 },
]

const memoryData = [
	{ time: '14:00', value: 35 },
	{ time: '14:05', value: 37 },
	{ time: '14:10', value: 38 },
	{ time: '14:15', value: 40 },
	{ time: '14:20', value: 42 },
	{ time: '14:25', value: 41 },
	{ time: '14:30', value: 43 },
	{ time: '14:35', value: 42 },
	{ time: '14:40', value: 40 },
	{ time: '14:45', value: 41 },
	{ time: '14:50', value: 43 },
	{ time: '14:55', value: 44 },
]

const diskIOData = [
	{ time: '14:00', read: 120, write: 80 },
	{ time: '14:05', read: 150, write: 95 },
	{ time: '14:10', read: 180, write: 110 },
	{ time: '14:15', read: 165, write: 105 },
	{ time: '14:20', read: 145, write: 90 },
	{ time: '14:25', read: 170, write: 100 },
	{ time: '14:30', read: 190, write: 120 },
	{ time: '14:35', read: 175, write: 110 },
	{ time: '14:40', read: 160, write: 95 },
	{ time: '14:45', read: 155, write: 88 },
	{ time: '14:50', read: 165, write: 92 },
	{ time: '14:55', read: 172, write: 98 },
]

const connectionsData = [
	{ time: '14:00', active: 42, idle: 8 },
	{ time: '14:05', active: 45, idle: 10 },
	{ time: '14:10', active: 48, idle: 9 },
	{ time: '14:15', active: 51, idle: 11 },
	{ time: '14:20', active: 47, idle: 10 },
	{ time: '14:25', active: 50, idle: 12 },
	{ time: '14:30', active: 53, idle: 13 },
	{ time: '14:35', active: 49, idle: 11 },
	{ time: '14:40', active: 46, idle: 10 },
	{ time: '14:45', active: 48, idle: 9 },
	{ time: '14:50', active: 50, idle: 11 },
	{ time: '14:55', active: 52, idle: 12 },
]

const chartConfig = {
	value: {
		label: 'Значение',
		color: 'hsl(var(--primary))',
	},
	read: {
		label: 'Чтение',
		color: 'hsl(var(--primary))',
	},
	write: {
		label: 'Запись',
		color: 'hsl(var(--chart-2))',
	},
	active: {
		label: 'Активные',
		color: 'hsl(var(--primary))',
	},
	idle: {
		label: 'Простаивающие',
		color: 'hsl(var(--chart-3))',
	},
} satisfies ChartConfig

export default function MonitoringTab() {
	const [timeRange, setTimeRange] = useState('1h')

	// Текущие метрики
	const currentMetrics = {
		cpu: 45,
		memory: 44,
		diskRead: 172,
		diskWrite: 98,
		connections: 64,
		qps: 1247, // queries per second
		avgQueryTime: 12.5, // ms
	}

	return (
		<div className='space-y-4'>
			{/* Временной диапазон */}
			<div className='flex items-center justify-between'>
				<div>
					<h3 className='text-lg font-medium'>Мониторинг в реальном времени</h3>
					<p className='text-sm text-muted-foreground'>
						Метрики производительности кластера
					</p>
				</div>
				<Select value={timeRange} onValueChange={setTimeRange}>
					<SelectTrigger className='w-[180px]'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='15m'>Последние 15 минут</SelectItem>
						<SelectItem value='1h'>Последний час</SelectItem>
						<SelectItem value='6h'>Последние 6 часов</SelectItem>
						<SelectItem value='24h'>Последние 24 часа</SelectItem>
						<SelectItem value='7d'>Последние 7 дней</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Текущие метрики */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>CPU</CardTitle>
						<CardDescription>Использование процессора</CardDescription>
						<CardAction>
							<Activity className='h-4 w-4 text-muted-foreground' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{currentMetrics.cpu}%</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Память</CardTitle>
						<CardDescription>Использование RAM</CardDescription>
						<CardAction>
							<Database className='h-4 w-4 text-muted-foreground' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{currentMetrics.memory}%</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Запросы/сек</CardTitle>
						<CardDescription>
							Среднее время: {currentMetrics.avgQueryTime}ms
						</CardDescription>
						<CardAction>
							<Clock className='h-4 w-4 text-muted-foreground' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{currentMetrics.qps}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Подключения</CardTitle>
						<CardDescription>Активных подключений</CardDescription>
						<CardAction>
							<Network className='h-4 w-4 text-muted-foreground' />
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{currentMetrics.connections}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Графики */}
			<div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
				{/* CPU Usage */}
				<Card>
					<CardHeader>
						<CardTitle>Использование CPU</CardTitle>
						<CardDescription>Загрузка процессора в процентах</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={chartConfig} className='h-64 w-full'>
							<AreaChart data={cpuData}>
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

				{/* Memory Usage */}
				<Card>
					<CardHeader>
						<CardTitle>Использование памяти</CardTitle>
						<CardDescription>Загрузка оперативной памяти</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={chartConfig} className='h-64 w-full'>
							<AreaChart data={memoryData}>
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

				{/* Disk I/O */}
				<Card>
					<CardHeader>
						<CardTitle>Дисковый I/O</CardTitle>
						<CardDescription>Операции чтения и записи (MB/s)</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={chartConfig} className='h-64 w-full'>
							<LineChart data={diskIOData}>
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
								/>
								<Line
									dataKey='read'
									type='monotone'
									stroke='var(--color-read)'
									strokeWidth={2}
									dot={false}
								/>
								<Line
									dataKey='write'
									type='monotone'
									stroke='var(--color-write)'
									strokeWidth={2}
									dot={false}
								/>
							</LineChart>
						</ChartContainer>
					</CardContent>
				</Card>

				{/* Connections */}
				<Card>
					<CardHeader>
						<CardTitle>Подключения</CardTitle>
						<CardDescription>
							Активные и простаивающие подключения
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={chartConfig} className='h-64 w-full'>
							<AreaChart data={connectionsData}>
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
								/>
								<Area
									dataKey='idle'
									type='monotone'
									stackId='1'
									fill='var(--color-idle)'
									fillOpacity={0.4}
									stroke='var(--color-idle)'
									strokeWidth={2}
								/>
								<Area
									dataKey='active'
									type='monotone'
									stackId='1'
									fill='var(--color-active)'
									fillOpacity={0.4}
									stroke='var(--color-active)'
									strokeWidth={2}
								/>
							</AreaChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

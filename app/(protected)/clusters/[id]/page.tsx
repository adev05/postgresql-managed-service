import { auth } from '@/auth'
import { getCluster } from '@/lib/api'
import { notFound } from 'next/navigation'
// import { TypographyH1 } from '@/components/ui/TypographyH1'
// import { CLUSTER_STATUS } from '@/constants/clusterStatuses'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Database,
	Users,
	HardDrive,
	Activity,
	FileText,
	Link,
	Settings,
	Wrench,
} from 'lucide-react'

interface ClusterPageProps {
	params: Promise<{ id: string }>
}

export default async function ClusterPage({ params }: ClusterPageProps) {
	const { id } = await params
	const session = await auth()
	const cluster = await getCluster(session?.access_token || '', id)

	if (!cluster) {
		notFound()
	}

	// const statusConfig = CLUSTER_STATUS[cluster.status.status]

	return (
		<section className='px-4 lg:px-6'>
			<Tabs defaultValue='overview' className='w-full'>
				<TabsList className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 w-full'>
					<TabsTrigger value='overview'>Обзор</TabsTrigger>
					<TabsTrigger value='databases'>Базы данных</TabsTrigger>
					<TabsTrigger value='users'>Пользователи</TabsTrigger>
					<TabsTrigger value='backups'>Резервные копии</TabsTrigger>
					<TabsTrigger value='monitoring'>Мониторинг</TabsTrigger>
					<TabsTrigger value='logs'>Журналы</TabsTrigger>
					<TabsTrigger value='connections'>Подключения</TabsTrigger>
					<TabsTrigger value='settings'>Настройки</TabsTrigger>
					<TabsTrigger value='maintenance'>Обслуживание</TabsTrigger>
				</TabsList>

				<TabsContent value='overview' className='mt-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Database className='w-5 h-5' />
								Обзор системы
							</CardTitle>
							<CardDescription>Общая информация о базе данных</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='p-4 bg-blue-50 rounded-lg'>
										<p className='text-sm text-gray-600'>Всего баз данных</p>
										<p className='text-2xl font-bold'>12</p>
									</div>
									<div className='p-4 bg-green-50 rounded-lg'>
										<p className='text-sm text-gray-600'>
											Активные подключения
										</p>
										<p className='text-2xl font-bold'>47</p>
									</div>
									<div className='p-4 bg-yellow-50 rounded-lg'>
										<p className='text-sm text-gray-600'>Использовано места</p>
										<p className='text-2xl font-bold'>2.3 GB</p>
									</div>
									<div className='p-4 bg-purple-50 rounded-lg'>
										<p className='text-sm text-gray-600'>Статус</p>
										<p className='text-2xl font-bold text-green-600'>Активна</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='databases' className='mt-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Database className='w-5 h-5' />
								Базы данных
							</CardTitle>
							<CardDescription>Управление базами данных</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-2'>
								<div className='p-3 border rounded-lg flex justify-between items-center'>
									<div>
										<p className='font-medium'>production_db</p>
										<p className='text-sm text-gray-500'>PostgreSQL 15.2</p>
									</div>
									<span className='text-green-600 text-sm'>Активна</span>
								</div>
								<div className='p-3 border rounded-lg flex justify-between items-center'>
									<div>
										<p className='font-medium'>staging_db</p>
										<p className='text-sm text-gray-500'>PostgreSQL 15.2</p>
									</div>
									<span className='text-green-600 text-sm'>Активна</span>
								</div>
								<div className='p-3 border rounded-lg flex justify-between items-center'>
									<div>
										<p className='font-medium'>test_db</p>
										<p className='text-sm text-gray-500'>PostgreSQL 15.2</p>
									</div>
									<span className='text-gray-400 text-sm'>Остановлена</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='users' className='mt-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Users className='w-5 h-5' />
								Пользователи
							</CardTitle>
							<CardDescription>
								Управление пользователями и правами доступа
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-2'>
								<div className='p-3 border rounded-lg flex justify-between items-center'>
									<div>
										<p className='font-medium'>admin</p>
										<p className='text-sm text-gray-500'>Суперпользователь</p>
									</div>
									<span className='text-xs bg-red-100 text-red-700 px-2 py-1 rounded'>
										SUPERUSER
									</span>
								</div>
								<div className='p-3 border rounded-lg flex justify-between items-center'>
									<div>
										<p className='font-medium'>app_user</p>
										<p className='text-sm text-gray-500'>Чтение/Запись</p>
									</div>
									<span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded'>
										READ/WRITE
									</span>
								</div>
								<div className='p-3 border rounded-lg flex justify-between items-center'>
									<div>
										<p className='font-medium'>readonly_user</p>
										<p className='text-sm text-gray-500'>Только чтение</p>
									</div>
									<span className='text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded'>
										READONLY
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='backups' className='mt-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<HardDrive className='w-5 h-5' />
								Резервные копии
							</CardTitle>
							<CardDescription>История резервного копирования</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-2'>
								<div className='p-3 border rounded-lg'>
									<div className='flex justify-between items-start'>
										<div>
											<p className='font-medium'>backup_2024_11_21.sql</p>
											<p className='text-sm text-gray-500'>Размер: 1.2 GB</p>
										</div>
										<span className='text-xs text-gray-500'>
											21.11.2024 03:00
										</span>
									</div>
								</div>
								<div className='p-3 border rounded-lg'>
									<div className='flex justify-between items-start'>
										<div>
											<p className='font-medium'>backup_2024_11_20.sql</p>
											<p className='text-sm text-gray-500'>Размер: 1.1 GB</p>
										</div>
										<span className='text-xs text-gray-500'>
											20.11.2024 03:00
										</span>
									</div>
								</div>
								<div className='p-3 border rounded-lg'>
									<div className='flex justify-between items-start'>
										<div>
											<p className='font-medium'>backup_2024_11_19.sql</p>
											<p className='text-sm text-gray-500'>Размер: 1.0 GB</p>
										</div>
										<span className='text-xs text-gray-500'>
											19.11.2024 03:00
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='monitoring' className='mt-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Activity className='w-5 h-5' />
								Мониторинг
							</CardTitle>
							<CardDescription>Производительность и метрики</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div>
									<div className='flex justify-between mb-2'>
										<span className='text-sm'>CPU</span>
										<span className='text-sm font-medium'>45%</span>
									</div>
									<div className='w-full bg-gray-200 rounded-full h-2'>
										<div
											className='bg-blue-600 h-2 rounded-full'
											style={{ width: '45%' }}
										></div>
									</div>
								</div>
								<div>
									<div className='flex justify-between mb-2'>
										<span className='text-sm'>Память</span>
										<span className='text-sm font-medium'>67%</span>
									</div>
									<div className='w-full bg-gray-200 rounded-full h-2'>
										<div
											className='bg-green-600 h-2 rounded-full'
											style={{ width: '67%' }}
										></div>
									</div>
								</div>
								<div>
									<div className='flex justify-between mb-2'>
										<span className='text-sm'>Диск</span>
										<span className='text-sm font-medium'>32%</span>
									</div>
									<div className='w-full bg-gray-200 rounded-full h-2'>
										<div
											className='bg-purple-600 h-2 rounded-full'
											style={{ width: '32%' }}
										></div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='logs' className='mt-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<FileText className='w-5 h-5' />
								Журналы
							</CardTitle>
							<CardDescription>Системные логи и события</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-1 font-mono text-xs bg-gray-900 text-gray-100 p-4 rounded-lg max-h-64 overflow-y-auto'>
								<p>
									[2024-11-21 10:23:15] INFO: Database connection established
								</p>
								<p>[2024-11-21 10:23:20] INFO: Query executed successfully</p>
								<p>[2024-11-21 10:24:02] WARN: Slow query detected (2.3s)</p>
								<p>[2024-11-21 10:25:11] INFO: Backup completed</p>
								<p>[2024-11-21 10:26:45] INFO: User admin logged in</p>
								<p>[2024-11-21 10:27:33] ERROR: Connection timeout</p>
								<p>[2024-11-21 10:28:01] INFO: Connection retry successful</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='connections' className='mt-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Link className='w-5 h-5' />
								Подключения
							</CardTitle>
							<CardDescription>
								Активные соединения с базой данных
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-2'>
								<div className='p-3 border rounded-lg'>
									<div className='flex justify-between items-center'>
										<div>
											<p className='font-medium'>192.168.1.100:5432</p>
											<p className='text-sm text-gray-500'>
												app_user • production_db
											</p>
										</div>
										<span className='text-green-600 text-sm'>Активно</span>
									</div>
								</div>
								<div className='p-3 border rounded-lg'>
									<div className='flex justify-between items-center'>
										<div>
											<p className='font-medium'>192.168.1.101:5432</p>
											<p className='text-sm text-gray-500'>
												admin • production_db
											</p>
										</div>
										<span className='text-green-600 text-sm'>Активно</span>
									</div>
								</div>
								<div className='p-3 border rounded-lg'>
									<div className='flex justify-between items-center'>
										<div>
											<p className='font-medium'>192.168.1.102:5432</p>
											<p className='text-sm text-gray-500'>
												readonly_user • production_db
											</p>
										</div>
										<span className='text-green-600 text-sm'>Активно</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='settings' className='mt-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Settings className='w-5 h-5' />
								Настройки
							</CardTitle>
							<CardDescription>Конфигурация базы данных</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div className='flex justify-between items-center p-3 border rounded-lg'>
									<div>
										<p className='font-medium'>
											Автоматическое резервное копирование
										</p>
										<p className='text-sm text-gray-500'>Ежедневно в 03:00</p>
									</div>
									<label className='relative inline-flex items-center cursor-pointer'>
										<input
											type='checkbox'
											className='sr-only peer'
											defaultChecked
										/>
										<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
									</label>
								</div>
								<div className='flex justify-between items-center p-3 border rounded-lg'>
									<div>
										<p className='font-medium'>Логирование запросов</p>
										<p className='text-sm text-gray-500'>
											Записывать все SQL запросы
										</p>
									</div>
									<label className='relative inline-flex items-center cursor-pointer'>
										<input
											type='checkbox'
											className='sr-only peer'
											defaultChecked
										/>
										<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
									</label>
								</div>
								<div className='flex justify-between items-center p-3 border rounded-lg'>
									<div>
										<p className='font-medium'>SSL соединения</p>
										<p className='text-sm text-gray-500'>
											Требовать защищенное подключение
										</p>
									</div>
									<label className='relative inline-flex items-center cursor-pointer'>
										<input
											type='checkbox'
											className='sr-only peer'
											defaultChecked
										/>
										<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
									</label>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='maintenance' className='mt-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Wrench className='w-5 h-5' />
								Обслуживание
							</CardTitle>
							<CardDescription>
								Инструменты обслуживания базы данных
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								<button className='w-full p-3 border rounded-lg hover:bg-gray-50 text-left'>
									<p className='font-medium'>Запустить VACUUM</p>
									<p className='text-sm text-gray-500'>
										Очистка неиспользуемого пространства
									</p>
								</button>
								<button className='w-full p-3 border rounded-lg hover:bg-gray-50 text-left'>
									<p className='font-medium'>Переиндексация</p>
									<p className='text-sm text-gray-500'>
										Перестроить все индексы
									</p>
								</button>
								<button className='w-full p-3 border rounded-lg hover:bg-gray-50 text-left'>
									<p className='font-medium'>Обновить статистику</p>
									<p className='text-sm text-gray-500'>
										Анализ таблиц для оптимизации
									</p>
								</button>
								<button className='w-full p-3 border rounded-lg hover:bg-red-50 text-left border-red-200'>
									<p className='font-medium text-red-600'>
										Перезапустить сервер
									</p>
									<p className='text-sm text-red-500'>
										Остановка всех подключений
									</p>
								</button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</section>
		// <main className='space-y-6'>
		// 	<div>
		// 		{/* <TypographyH1>{cluster.name}</TypographyH1> */}
		// 		<div className='flex items-center gap-2 mt-2'>
		// 			<div
		// 				className={`w-3 h-3 rounded-full animate-pulse ${statusConfig.variant}`}
		// 			/>
		// 			<span className='text-muted-foreground'>{statusConfig.label}</span>
		// 		</div>
		// 	</div>

		// 	<div className='grid gap-4 md:grid-cols-2'>
		// 		<div className='p-4 bg-secondary rounded-xl space-y-2'>
		// 			<h3 className='font-semibold'>Конфигурация</h3>
		// 			<div className='space-y-1 text-sm'>
		// 				<p className='flex justify-between'>
		// 					<span className='text-muted-foreground'>PostgreSQL версия:</span>
		// 					<span>{cluster.pg_version}</span>
		// 				</p>
		// 				<p className='flex justify-between'>
		// 					<span className='text-muted-foreground'>CPU:</span>
		// 					<span>{cluster.cpu} ядер</span>
		// 				</p>
		// 				<p className='flex justify-between'>
		// 					<span className='text-muted-foreground'>RAM:</span>
		// 					<span>{cluster.ram_mb} МБ</span>
		// 				</p>
		// 				<p className='flex justify-between'>
		// 					<span className='text-muted-foreground'>Storage:</span>
		// 					<span>{cluster.storage_gb} ГБ</span>
		// 				</p>
		// 			</div>
		// 		</div>

		// 		<div className='p-4 bg-secondary rounded-xl space-y-2'>
		// 			<h3 className='font-semibold'>Подключение</h3>
		// 			<div className='space-y-1 text-sm'>
		// 				<p className='flex justify-between'>
		// 					<span className='text-muted-foreground'>Endpoint:</span>
		// 					<span className='font-mono text-xs'>{cluster.endpoint}</span>
		// 				</p>
		// 				<p className='flex justify-between'>
		// 					<span className='text-muted-foreground'>Port:</span>
		// 					<span>{cluster.port}</span>
		// 				</p>
		// 			</div>
		// 		</div>
		// 	</div>
		// </main>
	)
}

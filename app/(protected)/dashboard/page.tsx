import { requireAuth } from '@/lib/auth-utils'
import { fetchClusters } from '@/lib/actions/clusters'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
	Database,
	Server,
	Activity,
	Clock,
	Plus,
	ArrowRight,
} from 'lucide-react'

export default async function DashboardPage() {
	const { session } = await requireAuth()
	const { clusters, total } = await fetchClusters(5, 0)

	const activeClusters = clusters.filter(
		c => c.status.status === 'RUNNING'
	).length
	const totalStorage = clusters.reduce((sum, c) => sum + c.storage_gb, 0)
	const totalRAM = clusters.reduce((sum, c) => sum + c.ram_mb, 0)

	return (
		<main className='space-y-6 p-6'>
			{/* Приветствие */}
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>
					Добро пожаловать, {session.user.first_name}!
				</h1>
				<p className='text-muted-foreground mt-2'>
					Управляйте своими PostgreSQL кластерами и мониторьте их
					производительность
				</p>
			</div>

			{/* Статистика */}
			<div className='grid gap-4 lg:grid-cols-2 xl:grid-cols-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Всего кластеров
						</CardTitle>
						<Database className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{total}</div>
						<p className='text-xs text-muted-foreground mt-1'>
							{activeClusters} активных
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Хранилище</CardTitle>
						<Server className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{totalStorage} ГБ</div>
						<p className='text-xs text-muted-foreground mt-1'>
							Общий объем дисков
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Память</CardTitle>
						<Activity className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{(totalRAM / 1024).toFixed(1)} ГБ
						</div>
						<p className='text-xs text-muted-foreground mt-1'>Выделено RAM</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Статус</CardTitle>
						<Clock className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-green-500'>Работает</div>
						<p className='text-xs text-muted-foreground mt-1'>
							Все системы в норме
						</p>
					</CardContent>
				</Card>
			</div>

			<div className='grid gap-6 lg:grid-cols-2'>
				{/* Последние кластеры */}
				<Card>
					<CardHeader>
						<CardTitle>Последние кластеры</CardTitle>
						<CardDescription>
							Ваши недавно созданные PostgreSQL кластеры
						</CardDescription>
					</CardHeader>
					<CardContent>
						{clusters.length === 0 ? (
							<div className='text-center py-8 text-muted-foreground'>
								<Database className='h-12 w-12 mx-auto mb-4 opacity-20' />
								<p className='mb-4'>У вас пока нет кластеров</p>
								<Link href='/clusters'>
									<Button>
										<Plus className='h-4 w-4 mr-2' />
										Создать первый кластер
									</Button>
								</Link>
							</div>
						) : (
							<div className='space-y-3'>
								{clusters.map(cluster => (
									<Link
										key={cluster.id}
										href={`/clusters/${cluster.id}`}
										className='block'
									>
										<div className='flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors'>
											<div className='flex items-center gap-3'>
												<Database className='h-5 w-5 text-muted-foreground' />
												<div>
													<p className='font-medium'>{cluster.name}</p>
													<p className='text-sm text-muted-foreground'>
														PostgreSQL {cluster.pg_version}
													</p>
												</div>
											</div>
											<Badge
												variant={
													cluster.status.status === 'RUNNING'
														? 'default'
														: 'secondary'
												}
											>
												{cluster.status.description}
											</Badge>
										</div>
									</Link>
								))}
								{total > 5 && (
									<Link href='/clusters'>
										<Button variant='ghost' className='w-full mt-2'>
											Показать все ({total})
											<ArrowRight className='h-4 w-4' />
										</Button>
									</Link>
								)}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Быстрые действия */}
				<Card>
					<CardHeader>
						<CardTitle>Быстрые действия</CardTitle>
						<CardDescription>
							Основные операции для работы с кластерами
						</CardDescription>
					</CardHeader>
					<CardContent className='flex flex-col gap-2'>
						<Link href='/clusters'>
							<Button className='w-full justify-start' variant='outline'>
								<Plus className='h-4 w-4' />
								Создать новый кластер
							</Button>
						</Link>
						<Link href='/clusters'>
							<Button className='w-full justify-start' variant='outline'>
								<Database className='h-4 w-4' />
								Управление кластерами
							</Button>
						</Link>
						<Link href='/settings'>
							<Button className='w-full justify-start' variant='outline'>
								<Activity className='h-4 w-4' />
								Настройки профиля
							</Button>
						</Link>
						<Link href='/help'>
							<Button className='w-full justify-start' variant='outline'>
								<Server className='h-4 w-4' />
								Документация и помощь
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		</main>
	)
}

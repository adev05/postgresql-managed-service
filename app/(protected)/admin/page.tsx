export default function AdminDashboardPage() {
	return (
		<div className='flex items-center justify-center h-full'>
			<div className='text-center'>
				<h1 className='text-2xl font-bold mb-2'>Admin Dashboard</h1>
				<p className='text-muted-foreground'>Coming soon...</p>
			</div>
		</div>
	)
}

// import React from 'react'
// import { getCurrentUser } from '@/lib/auth-roles'
// import { TypographyH1 } from '@/components/ui/TypographyH1'
// import { TypographyH3 } from '@/components/ui/TypographyH3'
// import { Card } from '@/components/ui/card'
// import { Database, Server, Users, MessageCircleQuestion } from 'lucide-react'

// export default async function AdminDashboard() {
// 	const user = await getCurrentUser()

// 	const adminStats = [
// 		{
// 			title: 'HyperV Хосты',
// 			description: 'Управление хостами инфраструктуры',
// 			icon: Server,
// 			href: '/admin/hyperv-hosts',
// 			color: 'bg-blue-100 dark:bg-blue-900',
// 			iconColor: 'text-blue-600 dark:text-blue-400',
// 		},
// 		{
// 			title: 'Кластеры',
// 			description: 'Управление PostgreSQL кластерами',
// 			icon: Database,
// 			href: '/admin/clusters',
// 			color: 'bg-green-100 dark:bg-green-900',
// 			iconColor: 'text-green-600 dark:text-green-400',
// 		},
// 		{
// 			title: 'Пользователи',
// 			description: 'Управление доступом и правами',
// 			icon: Users,
// 			href: '/admin/users',
// 			color: 'bg-purple-100 dark:bg-purple-900',
// 			iconColor: 'text-purple-600 dark:text-purple-400',
// 		},
// 		{
// 			title: 'Поддержка',
// 			description: 'Обращения и тикеты пользователей',
// 			icon: MessageCircleQuestion,
// 			href: '/admin/support',
// 			color: 'bg-orange-100 dark:bg-orange-900',
// 			iconColor: 'text-orange-600 dark:text-orange-400',
// 		},
// 	]

// 	return (
// 		<section className='px-4 lg:px-6 space-y-6'>
// 			<div>
// 				<TypographyH1>Администраторская панель</TypographyH1>
// 				<p className='text-muted-foreground mt-2'>
// 					Добро пожаловать, {user?.first_name}! Управляйте системой из одного места.
// 				</p>
// 			</div>

// 			{/* Статистика */}
// 			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
// 				{adminStats.map(stat => {
// 					const Icon = stat.icon
// 					return (
// 						<a key={stat.title} href={stat.href}>
// 							<Card className='p-6 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full'>
// 								<div className='flex items-start justify-between'>
// 									<div className='space-y-2 flex-1'>
// 										<TypographyH3 className='text-base'>{stat.title}</TypographyH3>
// 										<p className='text-sm text-muted-foreground'>{stat.description}</p>
// 									</div>
// 									<div className={`p-2 rounded-lg ${stat.color}`}>
// 										<Icon className={`w-6 h-6 ${stat.iconColor}`} />
// 									</div>
// 								</div>
// 							</Card>
// 						</a>
// 					)
// 				})}
// 			</div>

// 			{/* Недавние действия */}
// 			<div className='bg-card border rounded-lg p-6 space-y-4'>
// 				<TypographyH3>Недавние действия</TypographyH3>
// 				<div className='space-y-4'>
// 						{[
// 							{ action: 'Создан новый кластер', time: '2 часа назад', user: 'Система' },
// 							{ action: 'Добавлен новый пользователь', time: '5 часов назад', user: 'Admin' },
// 							{ action: 'Обновлена конфигурация хоста', time: '1 день назад', user: 'System' },
// 							{ action: 'Резервная копия завершена', time: '2 дня назад', user: 'Система' },
// 						].map((log, idx) => (
// 							<div key={idx} className='flex items-center justify-between py-3 border-b last:border-0'>
// 								<div>
// 									<p className='font-medium text-sm'>{log.action}</p>
// 									<p className='text-xs text-muted-foreground'>от {log.user}</p>
// 								</div>
// 								<span className='text-xs text-muted-foreground'>{log.time}</span>
// 							</div>
// 						))}
// 					</div>
// 			</div>
// 		</section>
// 	)
// }

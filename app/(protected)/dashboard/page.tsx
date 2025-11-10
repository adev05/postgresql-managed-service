import { requireAuth } from '@/lib/auth-utils'
import { TypographyH1 } from '@/components/ui/TypographyH1'
import { TypographyH3 } from '@/components/ui/TypographyH3'

export default async function DashboardPage() {
	const { session } = await requireAuth()

	return (
		<main className='space-y-6'>
			<div>
				<TypographyH1>
					Добро пожаловать, {session.user.first_name}!
				</TypographyH1>
				<TypographyH3>Панель управления PostgreSQL кластерами</TypographyH3>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				<div className='p-6 bg-secondary rounded-xl'>
					<h3 className='text-lg font-semibold mb-2'>Активные кластеры</h3>
					<p className='text-3xl font-bold'>0</p>
					<p className='text-sm text-muted-foreground mt-1'>
						Запущенных кластеров
					</p>
				</div>

				<div className='p-6 bg-secondary rounded-xl'>
					<h3 className='text-lg font-semibold mb-2'>Использование</h3>
					<p className='text-3xl font-bold'>0 ГБ</p>
					<p className='text-sm text-muted-foreground mt-1'>
						Занято дискового пространства
					</p>
				</div>

				<div className='p-6 bg-secondary rounded-xl'>
					<h3 className='text-lg font-semibold mb-2'>Запросы</h3>
					<p className='text-3xl font-bold'>0</p>
					<p className='text-sm text-muted-foreground mt-1'>
						Запросов за последний час
					</p>
				</div>
			</div>
		</main>
	)
}

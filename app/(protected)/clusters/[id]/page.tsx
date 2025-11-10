import { auth } from '@/auth'
import { getCluster } from '@/lib/api'
import { notFound } from 'next/navigation'
import { TypographyH1 } from '@/components/ui/TypographyH1'
import { CLUSTER_STATUS } from '@/constants/clusterStatuses'

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

	const statusConfig = CLUSTER_STATUS[cluster.status.status]

	return (
		<main className='space-y-6'>
			<div>
				<TypographyH1>{cluster.name}</TypographyH1>
				<div className='flex items-center gap-2 mt-2'>
					<div
						className={`w-3 h-3 rounded-full animate-pulse ${statusConfig.color}`}
					/>
					<span className='text-muted-foreground'>{statusConfig.label}</span>
				</div>
			</div>

			<div className='grid gap-4 md:grid-cols-2'>
				<div className='p-4 bg-secondary rounded-xl space-y-2'>
					<h3 className='font-semibold'>Конфигурация</h3>
					<div className='space-y-1 text-sm'>
						<p className='flex justify-between'>
							<span className='text-muted-foreground'>PostgreSQL версия:</span>
							<span>{cluster.pg_version}</span>
						</p>
						<p className='flex justify-between'>
							<span className='text-muted-foreground'>CPU:</span>
							<span>{cluster.cpu} ядер</span>
						</p>
						<p className='flex justify-between'>
							<span className='text-muted-foreground'>RAM:</span>
							<span>{cluster.ram_mb} МБ</span>
						</p>
						<p className='flex justify-between'>
							<span className='text-muted-foreground'>Storage:</span>
							<span>{cluster.storage_gb} ГБ</span>
						</p>
					</div>
				</div>

				<div className='p-4 bg-secondary rounded-xl space-y-2'>
					<h3 className='font-semibold'>Подключение</h3>
					<div className='space-y-1 text-sm'>
						<p className='flex justify-between'>
							<span className='text-muted-foreground'>Endpoint:</span>
							<span className='font-mono text-xs'>{cluster.endpoint}</span>
						</p>
						<p className='flex justify-between'>
							<span className='text-muted-foreground'>Port:</span>
							<span>{cluster.port}</span>
						</p>
					</div>
				</div>
			</div>
		</main>
	)
}

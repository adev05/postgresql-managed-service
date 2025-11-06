import { TypographyH5 } from '@/components/ui/TypographyH5'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import CreateClusterDialog from './CreateClusterDialog'

export interface ClusterStatus {
	id: number
	status: string
	description: string
}

export interface Cluster {
	id: string
	name: string
	pg_version: string
	cpu: number
	ram_mb: number
	storage_gb: number
	status: ClusterStatus
	endpoint: string
	port: number
	created_at: string
	updated_at: string
	deleted_at: string | null
}

interface ClustersListProps {
	clusters: Cluster[]
}

export default function ClustersList({ clusters }: ClustersListProps) {
	if (!clusters || clusters.length === 0) return null

	console.log({ clusters })

	return (
		<section className='grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
			{clusters.map(cluster => (
				<div
					key={cluster.id}
					className='p-4 gap-4 bg-secondary rounded-2xl flex items-center justify-between cursor-pointer group'
				>
					<div className='w-full space-y-2'>
						<TypographyH5>{cluster.name}</TypographyH5>
						<div className='space-y-1'>
							<p className='flex justify-between items-bottom text-sm text-muted-foreground gap-2'>
								<span className='text-nowrap'>Версия</span>
								<span className='border-b border-dotted border-black/50 w-full'></span>
								<span className='text-nowrap'>{cluster.pg_version}</span>
							</p>
							<p className='flex justify-between items-bottom text-sm text-muted-foreground gap-2'>
								<span className='text-nowrap'>CPU / RAM / STORAGE</span>
								<span className='border-b border-dotted border-black/50 w-full'></span>
								<span className='text-nowrap'>{`${cluster.cpu} Гб / ${cluster.ram_mb} Гб / ${cluster.storage_gb} Гб`}</span>
							</p>
						</div>
					</div>
					<ChevronRightIcon
						width={24}
						height={24}
						className='transition-transform duration-200 group-hover:translate-x-1 text-muted-foreground'
					/>
					{/* <CardHeader>
						<CardTitle>{cluster.name}</CardTitle>
						<CardDescription>База данных: {cluster.database}</CardDescription>
					</CardHeader>
					<CardContent>
						<p className='text-sm'>
							Статус:{' '}
							<span
								className={`font-medium ${
									cluster.status === 'active'
										? 'text-green-600'
										: cluster.status === 'stopped'
										? 'text-gray-500'
										: 'text-red-600'
								}`}
							>
								{cluster.status}
							</span>
						</p>
					</CardContent> */}
				</div>
			))}
			<CreateClusterDialog />
		</section>
	)
}

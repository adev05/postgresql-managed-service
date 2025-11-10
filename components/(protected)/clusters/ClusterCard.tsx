'use client'

import { TypographyH5 } from '@/components/ui/TypographyH5'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { CLUSTER_STATUS } from '@/constants/clusterStatuses'
import type { Cluster } from '@/types/cluster'
import { useRouter } from 'next/navigation'

interface ClusterCardProps {
	cluster: Cluster
}

export default function ClusterCard({ cluster }: ClusterCardProps) {
	const router = useRouter()
	const statusConfig = CLUSTER_STATUS[cluster.status.status]

	return (
		<div
			onClick={() => router.push(`/clusters/${cluster.id}`)}
			className='p-4 gap-4 bg-secondary rounded-2xl flex items-center justify-between cursor-pointer group hover:bg-secondary/80 transition-colors'
		>
			<div className='w-full space-y-2'>
				<TypographyH5>{cluster.name}</TypographyH5>
				<div className='space-y-1'>
					<InfoRow label='Версия' value={cluster.pg_version} />
					<InfoRow
						label='Статус'
						value={
							<div className='flex items-center gap-2'>
								<div
									className={`w-2 h-2 rounded-full animate-pulse ${statusConfig.color}`}
								/>
								<span className='text-nowrap'>{statusConfig.label}</span>
							</div>
						}
					/>
					<InfoRow
						label='CPU / RAM / STORAGE'
						value={`${cluster.cpu} ядер / ${cluster.ram_mb} МБ / ${cluster.storage_gb} ГБ`}
					/>
				</div>
			</div>
			<ChevronRightIcon
				width={24}
				height={24}
				className='transition-transform duration-200 group-hover:translate-x-1 text-muted-foreground shrink-0'
			/>
		</div>
	)
}

interface InfoRowProps {
	label: string
	value: React.ReactNode
}

function InfoRow({ label, value }: InfoRowProps) {
	return (
		<div className='flex justify-between items-bottom text-sm text-muted-foreground gap-2'>
			<span className='text-nowrap'>{label}</span>
			<span className='border-b border-dotted border-black/50 w-full' />
			{typeof value === 'string' ? (
				<span className='text-nowrap'>{value}</span>
			) : (
				value
			)}
		</div>
	)
}

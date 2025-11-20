import { Cluster } from '@/types/cluster'
import ClusterCard from '@/components/(protected)/clusters/ClusterCard'

interface ClustersListProps {
	clusters: Cluster[]
	viewMode?: 'grid' | 'list'
}

export default function ClustersList({
	clusters,
	viewMode = 'grid',
}: ClustersListProps) {
	if (!clusters || clusters.length === 0) return null

	return (
		<section
			className={
				viewMode === 'grid'
					? 'grid gap-4 lg:grid-cols-1 xl:grid-cols-4'
					: 'flex flex-col gap-4'
			}
		>
			{clusters.map(cluster => (
				<ClusterCard key={cluster.id} cluster={cluster} viewMode={viewMode} />
			))}
		</section>
	)
}

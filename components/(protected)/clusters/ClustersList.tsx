import CreateClusterDialog from '@/components/(protected)/clusters/CreateClusterDialog'
import { Cluster } from '@/types/cluster'
import ClusterCard from '@/components/(protected)/clusters/ClusterCard'

interface ClustersListProps {
	clusters: Cluster[]
}

export default function ClustersList({ clusters }: ClustersListProps) {
	if (!clusters || clusters.length === 0) return null

	return (
		<section className='grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
			{clusters.map(cluster => (
				<ClusterCard key={cluster.id} cluster={cluster} />
			))}
			<CreateClusterDialog variant='secondary' />
		</section>
	)
}

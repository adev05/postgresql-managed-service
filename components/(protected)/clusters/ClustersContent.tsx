import { auth } from '@/auth'
import { getClusters } from '@/lib/api'
import ClustersList from './ClustersList'
import { ClustersEmptyState } from './ClustersEmptyState'

export default async function ClustersContent() {
	const session = await auth()
	const clusters = await getClusters(session?.access_token || '')

	return clusters.length > 0 ? (
		<ClustersList clusters={clusters} />
	) : (
		<ClustersEmptyState />
	)
}

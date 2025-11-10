import { auth } from '@/auth'
import { getClusters } from '@/lib/api'
import ClustersList from '@/components/(protected)/clusters/ClustersList'
import { ClustersEmptyState } from '@/components/(protected)/clusters/ClustersEmptyState'

export default async function ClustersContent() {
	const session = await auth()
	const clusters = await getClusters(session?.access_token || '')

	return clusters.length > 0 ? (
		<ClustersList clusters={clusters} />
	) : (
		<ClustersEmptyState />
	)
}

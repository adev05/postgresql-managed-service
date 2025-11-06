import { auth } from '@/auth'
import { ClustersEmptyState } from '@/components/(protected)/clusters/ClustersEmptyState'
import ClustersList from '@/components/(protected)/clusters/ClustersList'
import { TypographyH1 } from '@/components/ui/TypographyH1'
import { TypographyH3 } from '@/components/ui/TypographyH3'
import { getClusters } from '@/lib/api'

export default async function Clusters() {
	const session = await auth()
	const clusters = await getClusters(session?.access_token || '')

	return (
		<main>
			<TypographyH1>Кластеры PostgreSQL</TypographyH1>
			<TypographyH3>Доступные кластеры</TypographyH3>
			{clusters.length > 0 ? (
				<ClustersList clusters={clusters} />
			) : (
				<ClustersEmptyState />
			)}
		</main>
	)
}

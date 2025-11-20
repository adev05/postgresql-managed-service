import { TypographyH1 } from '@/components/ui/TypographyH1'
import CreateClusterDialog from '@/components/(protected)/clusters/CreateClusterDialog'
import ClustersControls from '@/components/(protected)/clusters/ClustersControls'
import { auth } from '@/auth'
import { getClusters } from '@/lib/api'

export default async function ClustersPage() {
	// Загружаем данные на сервере
	const session = await auth()
	const accessToken = session?.access_token || ''

	const initialClusters = await getClusters(accessToken, {
		limit: 8,
		offset: 0,
	})

	return (
		<main>
			<div className='flex items-center justify-between mb-8 gap-4'>
				<TypographyH1>Кластеры PostgreSQL</TypographyH1>
				<CreateClusterDialog />
			</div>

			<section>
				<ClustersControls
					initialClusters={initialClusters}
					accessToken={accessToken}
				/>
			</section>
		</main>
	)
}

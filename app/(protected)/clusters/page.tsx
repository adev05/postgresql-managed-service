// import { TypographyH1 } from '@/components/ui/TypographyH1'
// import CreateClusterDialog from '@/components/(protected)/clusters/CreateClusterDialog'
// import ClustersControls from '@/components/(protected)/clusters/ClustersControls'
import { auth } from '@/auth'
import { getClusters } from '@/lib/api'
import ClustersDataTable from '@/components/(protected)/clusters/ClustersDataTable'

export default async function ClustersPage() {
	const session = await auth()
	const accessToken = session?.access_token || ''

	const { clusters, total } = await getClusters(accessToken, {
		limit: 10,
		offset: 0,
	})

	return (
		<section className='px-4 lg:px-6'>
			<ClustersDataTable clusters={clusters} total={total} />
		</section>
	)
}

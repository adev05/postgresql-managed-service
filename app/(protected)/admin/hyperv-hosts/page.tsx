import { auth } from '@/auth'
import HyperVHostsTable from '@/components/(protected)/admin/hyperv-hosts/HypervHostsTable'
import { getHyperVHosts } from '@/lib/api'

export default async function HyperVHostsPage() {
	const session = await auth()
	const accessToken = session?.access_token || ''

	const { hosts, total } = await getHyperVHosts(accessToken, {
		limit: 10,
		offset: 0,
	})

	return (
		<section className='px-4 lg:px-6'>
			<HyperVHostsTable initialHosts={hosts} initialTotal={total} />
		</section>
	)
}

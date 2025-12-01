import { auth } from '@/auth'
import { getCluster } from '@/lib/api'
import { notFound } from 'next/navigation'
import { ClusterProvider } from './cluster-provider'

interface ClusterLayoutProps {
	children: React.ReactNode
	params: Promise<{ id: string }>
}

export default async function ClusterLayout({
	children,
	params,
}: ClusterLayoutProps) {
	const { id } = await params
	const session = await auth()
	const cluster = await getCluster(session?.access_token || '', id)

	if (!cluster) {
		notFound()
	}

	return <ClusterProvider cluster={cluster}>{children}</ClusterProvider>
}

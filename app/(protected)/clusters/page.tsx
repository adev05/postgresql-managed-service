import { Suspense } from 'react'
import { TypographyH1 } from '@/components/ui/TypographyH1'
import { TypographyH3 } from '@/components/ui/TypographyH3'
import ClustersSkeleton from '@/components/(protected)/clusters/ClustersSkeleton'
import ClustersContent from '@/components/(protected)/clusters/ClustersContent'

export default function ClustersPage() {
	return (
		<main>
			<TypographyH1>Кластеры PostgreSQL</TypographyH1>
			<TypographyH3>Доступные кластеры</TypographyH3>
			<Suspense fallback={<ClustersSkeleton />}>
				<ClustersContent />
			</Suspense>
		</main>
	)
}

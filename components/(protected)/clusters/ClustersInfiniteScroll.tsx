'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Cluster } from '@/types/cluster'
import ClusterCard from '@/components/(protected)/clusters/ClusterCard'
import { Loader2 } from 'lucide-react'

interface ClustersInfiniteScrollProps {
	initialClusters: Cluster[]
	accessToken: string
	viewMode: 'grid' | 'list'
	searchQuery: string
}

const LIMIT = 8

export default function ClustersInfiniteScroll({
	initialClusters,
	accessToken,
	viewMode,
	searchQuery,
}: ClustersInfiniteScrollProps) {
	const [clusters, setClusters] = useState<Cluster[]>(initialClusters)
	const [offset, setOffset] = useState(LIMIT)
	const [hasMore, setHasMore] = useState(initialClusters.length === LIMIT)
	const [isLoading, setIsLoading] = useState(false)
	const observerRef = useRef<IntersectionObserver | null>(null)
	const loadMoreRef = useRef<HTMLDivElement>(null)

	// Фильтрация кластеров по поисковому запросу
	const filteredClusters = clusters.filter(cluster =>
		cluster.name.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const loadMoreClusters = useCallback(async () => {
		if (isLoading || !hasMore) return

		setIsLoading(true)
		try {
			const response = await fetch(
				`/api/clusters?limit=${LIMIT}&offset=${offset}`,
				{
					headers: {
						Authorization: accessToken,
					},
				}
			)

			if (!response.ok) throw new Error('Failed to fetch clusters')

			const newClusters: Cluster[] = await response.json()

			if (newClusters.length < LIMIT) {
				setHasMore(false)
			}

			setClusters(prev => [...prev, ...newClusters])
			setOffset(prev => prev + LIMIT)
		} catch (error) {
			console.error('Error loading more clusters:', error)
		} finally {
			setIsLoading(false)
		}
	}, [offset, isLoading, hasMore, accessToken])

	useEffect(() => {
		if (observerRef.current) observerRef.current.disconnect()

		observerRef.current = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting && hasMore && !isLoading) {
					loadMoreClusters()
				}
			},
			{ threshold: 0.1 }
		)

		if (loadMoreRef.current) {
			observerRef.current.observe(loadMoreRef.current)
		}

		return () => {
			if (observerRef.current) observerRef.current.disconnect()
		}
	}, [loadMoreClusters, hasMore, isLoading])

	return (
		<>
			<section
				className={
					viewMode === 'grid'
						? 'grid gap-4 3xl:grid-cols-4 2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1'
						: 'flex flex-col gap-4'
				}
			>
				{filteredClusters.map(cluster => (
					<ClusterCard key={cluster.id} cluster={cluster} viewMode={viewMode} />
				))}
			</section>

			{hasMore && (
				<div ref={loadMoreRef} className='flex justify-center py-8'>
					{isLoading && (
						<div className='flex items-center gap-2 text-muted-foreground'>
							<Loader2 className='w-5 h-5 animate-spin' />
							<span>Загрузка кластеров...</span>
						</div>
					)}
				</div>
			)}
		</>
	)
}

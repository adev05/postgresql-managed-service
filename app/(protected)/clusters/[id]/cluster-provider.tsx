'use client'

import { useEffect } from 'react'
import { useClusterStore } from '@/stores/cluster-store'
import { Cluster } from '@/types/cluster'

interface ClusterProviderProps {
	cluster: Cluster
	children: React.ReactNode
}

export function ClusterProvider({ cluster, children }: ClusterProviderProps) {
	const setCurrentCluster = useClusterStore(state => state.setCurrentCluster)

	useEffect(() => {
		setCurrentCluster(cluster)

		// Очистка при размонтировании
		return () => {
			setCurrentCluster(null)
		}
	}, [cluster, setCurrentCluster])

	return <>{children}</>
}

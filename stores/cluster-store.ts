import { Cluster } from '@/types/cluster'
import { create } from 'zustand'

interface ClusterStore {
	currentCluster: Cluster | null
	setCurrentCluster: (cluster: Cluster | null) => void
}

export const useClusterStore = create<ClusterStore>(set => ({
	currentCluster: null,
	setCurrentCluster: cluster => set({ currentCluster: cluster }),
}))

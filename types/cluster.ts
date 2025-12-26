import { ClusterStatusKey } from '@/constants/clusterStatuses'

export interface ClusterStatus {
	id: number
	status: ClusterStatusKey
	description: string
}

export interface Cluster {
	id: string
	name: string
	db_name: string
	pg_version: string
	cpu: number
	ram_mb: number
	storage_gb: number
	status: ClusterStatus
	endpoint: string
	port: number
	created_at: string
	updated_at: string
	deleted_at: string | null
}

export interface CreateClusterPayload {
	name: string
	pg_version: string
	cpu: number
	ram_mb: number
	storage_gb: number
	db_name: string
}

export interface ClusterResponse {
	id: string
	name: string
	db_name: string
	pg_version: string
	cpu: number
	ram_mb: number
	storage_gb: number
	created_at: string
}

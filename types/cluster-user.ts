export interface ClusterUserStatus {
	id: number
	status: string
	description: string
}

export interface ClusterUser {
	id: string
	cluster_id: string
	username: string
	permissions: string
	status_id: number
	created_at: string
	updated_at: string
	deleted_at: string | null
	status: ClusterUserStatus
}

export interface CreateClusterUserPayload {
	username: string
	permissions: string
}

import type { Cluster } from '@/types/cluster'
import { HyperVHost, HyperVHostAuditLog } from '@/types/hyperv-host'
import { ClusterUser } from '@/types/cluster-user'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
	throw new Error(
		'API_URL is not defined in environment variables. Make sure to set it in your .env file.'
	)
}

// Базовая функция для API запросов
async function apiFetch<T>(
	endpoint: string,
	token: string,
	options?: RequestInit
): Promise<T> {
	const res = await fetch(`${API_URL}${endpoint}`, {
		...options,
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
			...options?.headers,
		},
	})

	if (!res.ok) {
		const text = await res.text()
		let detail = `Failed to fetch: ${res.status} ${res.statusText}`

		try {
			const parsed = JSON.parse(text)
			detail = parsed.detail || detail
		} catch {
			// Если не JSON, используем дефолтное сообщение
		}

		throw new Error(detail)
	}

	return res.json()
}

interface GetClustersParams {
	limit?: number
	offset?: number
}

export async function getClusters(
	token: string,
	params?: GetClustersParams
): Promise<{ clusters: Cluster[]; total: number }> {
	if (!token) {
		return { clusters: [], total: 0 }
	}

	const { limit = 10, offset = 0 } = params || {}
	const queryParams = new URLSearchParams({
		limit: limit.toString(),
		offset: offset.toString(),
	})

	try {
		return await apiFetch<{ clusters: Cluster[]; total: number }>(
			`/clusters?${queryParams}`,
			token,
			{
				next: { revalidate: 0 },
			}
		)
	} catch (error) {
		console.error('Error fetching clusters:', error)
		return { clusters: [], total: 0 }
	}
}

export async function getCluster(
	token: string,
	id: string
): Promise<Cluster | null> {
	if (!token) {
		return null
	}

	try {
		return await apiFetch<Cluster>(`/clusters/${id}`, token, {
			next: { revalidate: 60 },
		})
	} catch (error) {
		console.error(`Error fetching cluster ${id}:`, error)
		return null
	}
}

interface GetHyperVHostsParams {
	limit?: number
	offset?: number
	show_deleted?: boolean
}

export async function getHyperVHosts(
	token: string,
	params?: GetHyperVHostsParams
): Promise<{ hosts: HyperVHost[]; total: number }> {
	if (!token) {
		return { hosts: [], total: 0 }
	}

	const { limit = 10, offset = 0, show_deleted = false } = params || {}
	const queryParams = new URLSearchParams({
		limit: limit.toString(),
		offset: offset.toString(),
		show_deleted: show_deleted.toString(),
	})

	try {
		return await apiFetch<{ hosts: HyperVHost[]; total: number }>(
			`/admin/hosts?${queryParams}`,
			token,
			{
				next: { revalidate: 0 },
			}
		)
	} catch (error) {
		console.error('Error fetching hyperv-hosts:', error)
		return { hosts: [], total: 0 }
	}
}

export async function getHyperVHost(
	token: string,
	id: string
): Promise<HyperVHost | null> {
	if (!token) {
		return null
	}

	try {
		return await apiFetch<HyperVHost>(`/hyperv-hosts/${id}`, token, {
			next: { revalidate: 60 },
		})
	} catch (error) {
		console.error(`Error fetching hyperv-host ${id}:`, error)
		return null
	}
}

export async function getHyperVHostAuditLogs(
	token: string,
	hostId: number
): Promise<HyperVHostAuditLog[]> {
	if (!token) {
		return []
	}

	try {
		return await apiFetch<HyperVHostAuditLog[]>(
			`/admin/hosts/${hostId}/audit`,
			token,
			{
				cache: 'no-store',
			}
		)
	} catch (error) {
		console.error(`Error fetching audit logs for host ${hostId}:`, error)
		return []
	}
}

interface GetClusterUsersParams {
	limit?: number
	offset?: number
}

export async function getClusterUsers(
	token: string,
	clusterId: string,
	params?: GetClusterUsersParams
): Promise<{ cluster_users: ClusterUser[]; total: number }> {
	if (!token) {
		return { cluster_users: [], total: 0 }
	}

	const { limit = 10, offset = 0 } = params || {}
	const queryParams = new URLSearchParams({
		limit: limit.toString(),
		offset: offset.toString(),
	})

	try {
		return await apiFetch<{ cluster_users: ClusterUser[]; total: number }>(
			`/clusters/${clusterId}/users?${queryParams}`,
			token,
			{
				next: { revalidate: 0 },
			}
		)
	} catch (error) {
		console.error('Error fetching cluster users:', error)
		return { cluster_users: [], total: 0 }
	}
}

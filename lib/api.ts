import type { Cluster } from '@/types/cluster'

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

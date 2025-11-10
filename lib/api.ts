import type { Cluster } from '@/types/cluster'

const API_URL = process.env.API_URL

if (!API_URL) {
	throw new Error('API_URL is not defined in environment variables')
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

export async function getClusters(token: string): Promise<Cluster[]> {
	if (!token) {
		return []
	}

	try {
		return await apiFetch<Cluster[]>('/clusters', token, {
			next: { revalidate: 0 }, // Next.js 15 способ вместо cache: 'no-store'
		})
	} catch (error) {
		console.error('Error fetching clusters:', error)
		return []
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
			next: { revalidate: 60 }, // Кэшируем на 60 секунд
		})
	} catch (error) {
		console.error(`Error fetching cluster ${id}:`, error)
		return null
	}
}

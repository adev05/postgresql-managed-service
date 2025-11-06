'use server'

import { auth } from '@/auth'

export interface CreateClusterPayload {
	name: string
	pg_version: string
	cpu: number
	ram_mb: number
	storage_gb: number
}

export interface ClusterResponse {
	id: string
	name: string
	pg_version: string
	cpu: number
	ram_mb: number
	storage_gb: number
	created_at: string
}

export async function createCluster(
	data: CreateClusterPayload
): Promise<ClusterResponse> {
	const session = await auth()
	const token = session?.access_token

	if (!token) {
		throw new Error('Unauthorized: no token found')
	}

	const res = await fetch(`${process.env.API_URL}/clusters`, {
		method: 'POST',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
		cache: 'no-store',
	})

	if (!res.ok) {
		const text = await res.text()
		const { detail } = JSON.parse(text)
		throw new Error(detail || 'Произошла ошибка')
	}

	return res.json() as Promise<ClusterResponse>
}

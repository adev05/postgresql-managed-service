'use server'

import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import type { CreateClusterPayload, ClusterResponse } from '@/types/cluster'

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
	})

	if (!res.ok) {
		const text = await res.text()
		let detail = 'Произошла ошибка'
		try {
			const parsed = JSON.parse(text)
			detail = parsed.detail || detail
		} catch {
			// Если не JSON, используем дефолтное сообщение
		}
		throw new Error(detail)
	}

	const result = await res.json()

	// Обновляем страницу со списком кластеров
	revalidatePath('/clusters')

	return result
}

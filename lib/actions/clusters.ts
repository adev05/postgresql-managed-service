'use server'

import { auth } from '@/auth'
import { getClusters as apiGetClusters } from '@/lib/api'

export async function fetchClusters(limit: number, offset: number) {
	const session = await auth()

	if (!session?.access_token) {
		return { clusters: [], total: 0 }
	}

	return apiGetClusters(session.access_token, { limit, offset })
}

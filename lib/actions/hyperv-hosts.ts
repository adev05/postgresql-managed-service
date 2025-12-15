'use server'

import { auth } from '@/auth'
import { getHyperVHosts as apiGetHyperVHosts } from '@/lib/api'

export async function fetchHyperVHosts(limit: number, offset: number) {
	const session = await auth()

	if (!session?.access_token) {
		return { hosts: [], total: 0 }
	}

	return apiGetHyperVHosts(session.access_token, { limit, offset })
}

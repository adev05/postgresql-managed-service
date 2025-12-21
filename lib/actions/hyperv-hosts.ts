'use server'

import { auth } from '@/auth'
import { getHyperVHosts as apiGetHyperVHosts } from '@/lib/api'

export async function fetchHyperVHosts(
	limit: number,
	offset: number,
	showDeleted: boolean = false
) {
	const session = await auth()

	if (!session?.access_token) {
		return { hosts: [], total: 0 }
	}

	return apiGetHyperVHosts(session.access_token, {
		limit,
		offset,
		show_deleted: showDeleted,
	})
}

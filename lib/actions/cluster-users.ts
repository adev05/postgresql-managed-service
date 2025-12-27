'use server'

import { auth } from '@/auth'
import { getClusterUsers } from '@/lib/api'

export async function fetchClusterUsers(
	clusterId: string,
	pageSize: number,
	offset: number
) {
	const session = await auth()
	const accessToken = session?.access_token || ''

	return await getClusterUsers(accessToken, clusterId, {
		limit: pageSize,
		offset,
	})
}

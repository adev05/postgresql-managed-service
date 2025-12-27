'use server'

import { auth } from '@/auth'
import { ClusterUser, CreateClusterUserPayload } from '@/types/cluster-user'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
	throw new Error('API_URL is not defined in environment variables')
}

export async function createClusterUser(
	clusterId: string,
	payload: CreateClusterUserPayload
): Promise<ClusterUser> {
	const session = await auth()
	if (!session?.access_token) {
		throw new Error('Unauthorized')
	}

	const res = await fetch(`${API_URL}/clusters/${clusterId}/users`, {
		method: 'POST',
		headers: {
			Authorization: session.access_token,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	})

	if (!res.ok) {
		const text = await res.text()
		let detail = `Failed to create user: ${res.status} ${res.statusText}`

		try {
			const parsed = JSON.parse(text)
			detail = parsed.detail || detail
		} catch {
			// use default message
		}

		throw new Error(detail)
	}

	return res.json()
}

export async function deleteClusterUser(
	clusterId: string,
	userId: string
): Promise<void> {
	const session = await auth()
	if (!session?.access_token) {
		throw new Error('Unauthorized')
	}

	const res = await fetch(`${API_URL}/clusters/${clusterId}/users/${userId}`, {
		method: 'DELETE',
		headers: {
			Authorization: session.access_token,
		},
	})

	if (!res.ok) {
		const text = await res.text()
		let detail = `Failed to delete user: ${res.status} ${res.statusText}`

		try {
			const parsed = JSON.parse(text)
			detail = parsed.detail || detail
		} catch {
			// use default message
		}

		throw new Error(detail)
	}
}

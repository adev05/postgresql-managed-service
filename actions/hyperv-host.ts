'use server'

import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import type { CreateHyperVHostPayload, HyperVHost } from '@/types/hyperv-host'

export async function createHyperVHost(
	data: CreateHyperVHostPayload
): Promise<HyperVHost> {
	const session = await auth()
	const token = session?.access_token

	if (!token) {
		throw new Error('Unauthorized: no token found')
	}

	const res = await fetch(`${process.env.API_URL}/admin/hosts`, {
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

	// Обновляем страницу со списком хостов
	revalidatePath('/admin/hyperv-hosts')

	return result
}

export async function updateHyperVHost(
	hostId: number,
	data: CreateHyperVHostPayload
): Promise<HyperVHost> {
	const session = await auth()
	const token = session?.access_token

	if (!token) {
		throw new Error('Unauthorized: no token found')
	}

	const res = await fetch(`${process.env.API_URL}/admin/hosts/${hostId}`, {
		method: 'PUT',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	if (!res.ok) {
		const text = await res.text()
		let detail = 'Произошла ошибка при обновлении'
		try {
			const parsed = JSON.parse(text)
			detail = parsed.detail || detail
		} catch {
			// Если не JSON, используем дефолтное сообщение
		}
		throw new Error(detail)
	}

	const result = await res.json()

	// Обновляем страницу со списком хостов
	revalidatePath('/admin/hyperv-hosts')

	return result
}

export async function deleteHyperVHost(hostId: number): Promise<void> {
	const session = await auth()
	const token = session?.access_token

	if (!token) {
		throw new Error('Unauthorized: no token found')
	}

	const res = await fetch(`${process.env.API_URL}/admin/hosts/${hostId}`, {
		method: 'DELETE',
		headers: {
			Authorization: token,
		},
	})

	if (!res.ok) {
		const text = await res.text()
		let detail = 'Произошла ошибка при удалении'
		try {
			const parsed = JSON.parse(text)
			detail = parsed.detail || detail
		} catch {
			// Если не JSON, используем дефолтное сообщение
		}
		throw new Error(detail)
	}

	// Обновляем страницу со списком хостов
	revalidatePath('/admin/hyperv-hosts')
}

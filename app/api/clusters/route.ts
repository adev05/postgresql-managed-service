'use server'

import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const limit = searchParams.get('limit') || '8'
	const offset = searchParams.get('offset') || '0'
	const token = request.headers.get('Authorization')

	if (!token) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const response = await fetch(
			`${API_URL}/clusters?limit=${limit}&offset=${offset}`,
			{
				headers: {
					Authorization: token,
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
			}
		)

		if (!response.ok) {
			throw new Error(`API responded with status ${response.status}`)
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Error fetching clusters:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch clusters' },
			{ status: 500 }
		)
	}
}

import { NextResponse } from 'next/server'

export async function GET() {
	return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}

// import { NextRequest, NextResponse } from 'next/server'
// import { auth } from '@/auth'

// const API_URL = process.env.API_URL

// export async function GET(request: NextRequest) {
// 	const session = await auth()

// 	if (!session?.access_token) {
// 		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
// 	}

// 	const searchParams = request.nextUrl.searchParams
// 	const limit = searchParams.get('limit') || '10'
// 	const offset = searchParams.get('offset') || '0'

// 	try {
// 		const response = await fetch(
// 			`${API_URL}/admin/hosts?limit=${limit}&offset=${offset}`,
// 			{
// 				headers: {
// 					Authorization: session.access_token,
// 					'Content-Type': 'application/json',
// 				},
// 			}
// 		)

// 		if (!response.ok) {
// 			const text = await response.text()
// 			return NextResponse.json({ error: text }, { status: response.status })
// 		}

// 		const data = await response.json()
// 		return NextResponse.json(data)
// 	} catch (error) {
// 		console.error('API Error:', error)
// 		return NextResponse.json(
// 			{ error: 'Internal Server Error' },
// 			{ status: 500 }
// 		)
// 	}
// }

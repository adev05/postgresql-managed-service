import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/dashboard', '/clusters', '/help']
const PUBLIC_PATHS = ['/']

export async function proxy(req: NextRequest) {
	const token = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
		secureCookie: true,
	})
	const { pathname } = req.nextUrl

	if (
		PROTECTED_PATHS.some(
			path => pathname === path || pathname.startsWith(path + '/')
		) &&
		!token
	) {
		return NextResponse.redirect(new URL('/', req.url))
	}

	const allowedPaths = [...PUBLIC_PATHS, ...PROTECTED_PATHS]
	const isAllowed = allowedPaths.some(
		path => pathname === path || pathname.startsWith(path + '/')
	)
	if (!isAllowed) {
		return NextResponse.redirect(new URL('/', req.url))
	}

	if (token && pathname === '/') {
		return NextResponse.redirect(new URL('/dashboard', req.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!_next|api|favicon.ico).*)'],
}

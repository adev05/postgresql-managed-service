import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		serverActions: {
			allowedOrigins: ['localhost:3000', 'm6bvjg40-3000.euw.devtunnels.ms'],
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 't.me',
				pathname: '/i/userpic/**',
			},
		],
	},
}

export default nextConfig

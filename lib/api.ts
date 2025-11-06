export async function getClusters(token: string) {
	try {
		const res = await fetch(`${process.env.API_URL}/clusters`, {
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		})

		if (!res.ok) {
			throw new Error(
				`Failed to fetch clusters: ${res.status} ${res.statusText}`
			)
		}

		const data = await res.json()
		return data
	} catch (error) {
		console.error('Error fetching clusters:', error)
		return null
	}
}

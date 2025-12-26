import { signIn } from 'next-auth/react'
import { Button } from '../ui/button'

const IS_DEV = process.env.NEXT_PUBLIC_NODE_ENV === 'development'

export function DevLoginButton() {
	const handleDevLogin = async () => {
		try {
			const result = {
				id: 0,
				first_name: 'dev_first_name',
				last_name: 'dev_last_name',
				username: 'dev_username',
				photo_url: 'https://github.com/shadcn.png',
				auth_date: Number(new Date()),
				hash: 'ef34f67ca098a12cfbd8054eac530e31e296d42f3f03e916d52db6d4867535cd',
			}

			await signIn('telegram', {
				...result,
				redirect: true,
				callbackUrl: '/dashboard',
			})
		} catch (error) {
			console.error('Dev login error:', error)
		}
	}

	if (!IS_DEV) return <></>

	return <Button onClick={handleDevLogin}>dev auth</Button>
}

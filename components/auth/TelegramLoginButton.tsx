'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

const TELEGRAM_BOT_ID = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID

if (!TELEGRAM_BOT_ID) {
	console.error('NEXT_PUBLIC_TELEGRAM_BOT_ID is not defined')
}

export function TelegramLoginButton() {
	const [isLoading, setIsLoading] = useState(false)

	const handleTelegramLogin = useCallback(() => {
		if (!TELEGRAM_BOT_ID) {
			alert('Telegram Bot ID не настроен')
			return
		}

		setIsLoading(true)

		const params = new URLSearchParams({
			bot_id: TELEGRAM_BOT_ID,
			origin: window.location.origin,
		})

		const url = `https://oauth.telegram.org/auth?${params.toString()}`
		const popup = window.open(url, '_blank', 'width=400,height=600')

		if (!popup) {
			alert('Пожалуйста, разрешите всплывающие окна для входа через Telegram')
			setIsLoading(false)
			return
		}

		const listener = async (event: MessageEvent) => {
			if (event.origin !== 'https://oauth.telegram.org') return

			window.removeEventListener('message', listener)
			popup.close()

			try {
				const data = JSON.parse(event.data)

				if (data.event !== 'auth_result') {
					setIsLoading(false)
					return
				}

				await signIn('telegram', {
					...data.result,
					redirect: true,
					callbackUrl: '/dashboard',
				})
			} catch (error) {
				console.error('Telegram login error:', error)
				alert('Ошибка при входе через Telegram')
				setIsLoading(false)
			}
		}

		window.addEventListener('message', listener)

		// Таймаут на случай, если пользователь закроет окно
		const timeout = setTimeout(() => {
			window.removeEventListener('message', listener)
			setIsLoading(false)
		}, 300000) // 5 минут

		// Проверяем, не закрыто ли окно
		const checkClosed = setInterval(() => {
			if (popup.closed) {
				clearInterval(checkClosed)
				clearTimeout(timeout)
				window.removeEventListener('message', listener)
				setIsLoading(false)
			}
		}, 1000)
	}, [])

	return (
		<Button
			onClick={handleTelegramLogin}
			variant='telegram'
			disabled={isLoading || !TELEGRAM_BOT_ID}
		>
			<svg
				width='24'
				height='20'
				viewBox='0 0 24 20'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M1.47093 8.71046C1.47093 8.71046 12.0862 4.32022 15.7679 2.77336C17.1779 2.15534 21.9647 0.17671 21.9647 0.17671C21.9647 0.17671 24.1728 -0.689242 23.9892 1.41275C23.928 2.2787 23.4371 5.30833 22.9451 8.58588C22.2095 13.2241 21.4115 18.2952 21.4115 18.2952C21.4115 18.2952 21.2891 19.7175 20.2463 19.9642C19.2023 20.2121 17.4863 19.0995 17.1791 18.8515C16.9331 18.6665 12.577 15.8836 10.981 14.5218C10.5514 14.1517 10.0606 13.4091 11.0422 12.5444C13.2514 10.5028 15.8903 7.96786 17.4863 6.36053C18.2219 5.61794 18.9575 3.88603 15.8903 5.98924C13.0256 7.97617 10.1415 9.93433 7.23819 11.8634C7.23819 11.8634 6.25658 12.4827 4.41576 11.9251C2.57614 11.3688 0.42812 10.6274 0.42812 10.6274C0.42812 10.6274 -1.04429 9.69977 1.47213 8.71046'
					fill='currentColor'
				/>
			</svg>
			<span>{isLoading ? 'Вход...' : 'Войти через Telegram'}</span>
		</Button>
	)
}

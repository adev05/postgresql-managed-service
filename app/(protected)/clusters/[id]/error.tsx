'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'

interface ErrorProps {
	error: Error & { digest?: string }
	reset: () => void
}

export default function ClusterError({ error, reset }: ErrorProps) {
	const router = useRouter()

	useEffect(() => {
		console.error('Cluster page error:', error)
	}, [error])

	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant='icon'>
					<ExclamationTriangleIcon className='text-destructive' />
				</EmptyMedia>
				<EmptyTitle>Не удалось загрузить кластер</EmptyTitle>
				<EmptyDescription>
					Кластер не найден или произошла ошибка при загрузке данных.
				</EmptyDescription>
				{error.message && (
					<p className='text-sm text-muted-foreground mt-2'>{error.message}</p>
				)}
			</EmptyHeader>
			<EmptyContent className='flex gap-2'>
				<Button onClick={reset} variant='positive'>
					Попробовать снова
				</Button>
				<Button onClick={() => router.push('/clusters')} variant='secondary'>
					Вернуться к списку
				</Button>
			</EmptyContent>
		</Empty>
	)
}

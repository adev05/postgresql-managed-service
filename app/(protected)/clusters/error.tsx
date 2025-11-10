'use client'

import { useEffect } from 'react'
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

export default function ClustersError({ error, reset }: ErrorProps) {
	useEffect(() => {
		console.error('Clusters page error:', error)
	}, [error])

	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant='icon'>
					<ExclamationTriangleIcon className='text-destructive' />
				</EmptyMedia>
				<EmptyTitle>Произошла ошибка</EmptyTitle>
				<EmptyDescription>
					Не удалось загрузить кластеры. Попробуйте обновить страницу.
				</EmptyDescription>
				{error.message && (
					<p className='text-sm text-muted-foreground mt-2'>{error.message}</p>
				)}
			</EmptyHeader>
			<EmptyContent>
				<Button onClick={reset} variant='positive'>
					Попробовать снова
				</Button>
			</EmptyContent>
		</Empty>
	)
}

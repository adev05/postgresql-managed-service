import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty'
import { CubeIcon } from '@heroicons/react/24/solid'

export default function ClusterNotFound() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant='icon'>
					<CubeIcon className='text-muted-foreground' />
				</EmptyMedia>
				<EmptyTitle>Кластер не найден</EmptyTitle>
				<EmptyDescription>
					Кластер с указанным ID не существует или был удалён.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Link href='/clusters'>
					<Button variant='positive'>Вернуться к списку кластеров</Button>
				</Link>
			</EmptyContent>
		</Empty>
	)
}

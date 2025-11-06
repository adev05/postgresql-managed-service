import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty'
import { CubeIcon } from '@heroicons/react/24/solid'
import CreateClusterDialog from './CreateClusterDialog'

export function ClustersEmptyState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant='icon'>
					<CubeIcon />
				</EmptyMedia>
				<EmptyTitle>Кластеров пока нет</EmptyTitle>
				<EmptyDescription>
					Создайте первый кластер, чтобы начать работу.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<CreateClusterDialog />
			</EmptyContent>
		</Empty>
	)
}

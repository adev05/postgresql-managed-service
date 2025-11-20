'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/solid'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import ClustersInfiniteScroll from './ClustersInfiniteScroll'
import { ClustersEmptyState } from './ClustersEmptyState'
import { Cluster } from '@/types/cluster'
import CreateClusterDialog from './CreateClusterDialog'

interface ClustersControlsProps {
	initialClusters: Cluster[]
	accessToken: string
}

export default function ClustersControls({
	initialClusters,
	accessToken,
}: ClustersControlsProps) {
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
	const [searchQuery, setSearchQuery] = useState('')

	return (
		<>
			<div className='flex items-center gap-4 mb-6 flex-wrap'>
				{/* <p className='text-2xl font-semibold'>Доступные кластеры</p> */}
				<div className='relative w-full max-w-sm'>
					<MagnifyingGlassIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none' />
					<Input
						placeholder='Поиск по кластерам'
						className='pl-10'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className='flex items-center gap-3 ml-auto'>
					<ToggleGroup
						type='single'
						value={viewMode}
						onValueChange={value =>
							value && setViewMode(value as 'grid' | 'list')
						}
						className='rounded-xl'
					>
						<ToggleGroupItem
							value='grid'
							aria-label='Вид сеткой'
							className='gap-2'
						>
							<Squares2X2Icon className='w-4 h-4' />
							<span className='hidden sm:inline'>Сетка</span>
						</ToggleGroupItem>
						<ToggleGroupItem
							value='list'
							aria-label='Вид списком'
							className='gap-2'
						>
							<ListBulletIcon className='w-4 h-4' />
							<span className='hidden sm:inline'>Список</span>
						</ToggleGroupItem>
					</ToggleGroup>
					<CreateClusterDialog />
				</div>
			</div>

			{initialClusters.length > 0 ? (
				<ClustersInfiniteScroll
					initialClusters={initialClusters}
					accessToken={accessToken}
					viewMode={viewMode}
					searchQuery={searchQuery}
				/>
			) : (
				<ClustersEmptyState />
			)}
		</>
	)
}

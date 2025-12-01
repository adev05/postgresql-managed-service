'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '../ui/breadcrumb'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useMemo } from 'react'
import { useClusterStore } from '@/stores/cluster-store'

const PATH_NAMES: Record<string, string> = {
	dashboard: 'Главная',
	clusters: 'Кластеры',
	settings: 'Настройки',
	help: 'Помощь',
	search: 'Поиск',
}

export function ProtectedHeader() {
	const pathname = usePathname()
	const currentCluster = useClusterStore(state => state.currentCluster)

	const breadcrumbs = useMemo(() => {
		const segments = pathname.split('/').filter(Boolean)
		const items = []

		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i]
			const path = '/' + segments.slice(0, i + 1).join('/')
			const isLast = i === segments.length - 1

			// Проверяем, является ли сегмент ID (для динамических роутов)
			const prevSegment = i > 0 ? segments[i - 1] : null

			// Если предыдущий сегмент - clusters, то текущий это ID кластера
			if (prevSegment === 'clusters') {
				// Это ID кластера - берем название из store
				const clusterName = currentCluster?.name || ``
				items.push({
					label: clusterName,
					path: path,
					isLast: isLast,
				})
			} else if (PATH_NAMES[segment]) {
				// Это известный путь
				items.push({
					label: PATH_NAMES[segment],
					path: path,
					isLast: isLast,
				})
			}
		}

		return items
	}, [pathname, currentCluster])

	// Если нет breadcrumbs, не показываем их
	if (breadcrumbs.length === 0) {
		return (
			<header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
				<div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-2'>
					<SidebarTrigger />
					<div className='ml-auto flex items-center gap-2'>
						<ModeToggle />
					</div>
				</div>
			</header>
		)
	}

	return (
		<header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
			<div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-2'>
				<SidebarTrigger />
				<Separator
					orientation='vertical'
					className='mx-2 data-[orientation=vertical]:h-4'
				/>
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.map(crumb => (
							<Fragment key={crumb.path}>
								<BreadcrumbItem>
									{crumb.isLast ? (
										<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
									) : (
										<BreadcrumbLink asChild>
											<Link href={crumb.path}>{crumb.label}</Link>
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
								{!crumb.isLast && <BreadcrumbSeparator />}
							</Fragment>
						))}
					</BreadcrumbList>
				</Breadcrumb>
				<div className='ml-auto flex items-center gap-2'>
					<ModeToggle />
				</div>
			</div>
		</header>
	)
}

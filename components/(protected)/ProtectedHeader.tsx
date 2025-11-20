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

export function ProtectedHeader() {
	return (
		<>
			<header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
				<div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-2'>
					<SidebarTrigger />
					<Separator
						orientation='vertical'
						className='mx-2 data-[orientation=vertical]:h-4'
					/>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href='/'>Home</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href='/docs/components'>Components</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Breadcrumb</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					<div className='ml-auto flex items-center gap-2'>
						<ModeToggle />
					</div>
				</div>
			</header>
		</>
	)
}

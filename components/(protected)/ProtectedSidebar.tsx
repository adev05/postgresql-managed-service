'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '../ui/sidebar'
import {
	Database,
	ChevronsUpDownIcon,
	House,
	LogOutIcon,
	MessageCircleQuestionMark,
	Search,
	Settings,
	UserRound,
} from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { handleSignOut } from '@/app/actions/auth'
import { Spinner } from '../ui/spinner'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Logotype } from '../ui/logotype'

const data = {
	navMain: [
		{
			title: 'Главная',
			url: '/dashboard',
			icon: House,
		},
		{
			title: 'Кластеры PostgreSQL',
			url: '/clusters',
			icon: Database,
		},
	],
	navSecondary: [
		{
			title: 'Настройки',
			url: '/settings',
			icon: Settings,
		},
		{
			title: 'Центр поддержки',
			url: '/help',
			icon: MessageCircleQuestionMark,
		},
		{
			title: 'Поиск',
			url: '/search',
			icon: Search,
		},
	],
}

export function ProtectedSidebar() {
	const pathname = usePathname()
	const { data: session, status } = useSession()

	const user = session?.user

	if (status === 'loading') {
		return (
			<Sidebar>
				<div className='flex items-center justify-center h-full'>
					<Spinner />
				</div>
			</Sidebar>
		)
	}

	return (
		<Sidebar collapsible='offcanvas' variant='inset'>
			<SidebarHeader>
				<SidebarGroup>
					<SidebarMenuButton asChild>
						<Logotype />
					</SidebarMenuButton>
				</SidebarGroup>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{data.navMain.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										isActive={pathname === item.url}
										asChild
										size='md'
									>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup className='mt-auto'>
					<SidebarGroupContent>
						<SidebarMenu>
							{data.navSecondary.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										isActive={pathname === item.url}
										asChild
										size='md'
									>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
						>
							<Avatar>
								<AvatarFallback className='bg-muted'>
									<UserRound className='text-muted-foreground size-4' />
								</AvatarFallback>
							</Avatar>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-medium'>{`${user?.first_name} ${user?.last_name}`}</span>
								<span className='truncate text-xs'>{`@${user?.username}`}</span>
							</div>
							<ChevronsUpDownIcon className='ml-auto size-4' />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent side='right' align='start'>
						<DropdownMenuLabel className='p-0 font-normal'>
							<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
								<Avatar>
									<AvatarFallback className='bg-muted'>
										<UserRound className='text-muted-foreground  size-4' />
									</AvatarFallback>
								</Avatar>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-medium'>{`${user?.first_name} ${user?.last_name}`}</span>
									<span className='truncate text-xs'>{`@${user?.username}`}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => handleSignOut()}>
								<LogOutIcon />
								Выйти
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarFooter>
		</Sidebar>
	)
}

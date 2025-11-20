'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import {
	ChevronRightIcon,
	CubeIcon,
	HomeIcon,
	QuestionMarkCircleIcon,
	UserCircleIcon,
} from '@heroicons/react/24/solid'
import { UserAvatar } from '@/components/ui/UserAvatar'

const links = [
	{ href: '/dashboard', label: 'Главная', icon: HomeIcon },
	{ href: '/clusters', label: 'Кластеры PostgreSQL', icon: CubeIcon },
	{ href: '/help', label: 'Центр поддержки', icon: QuestionMarkCircleIcon },
]

export function ProtectedSidebar() {
	const pathname = usePathname()
	const { data: session } = useSession()

	const user = session?.user

	return (
		<aside className='w-[280px] bg-muted border-r flex flex-col'>
			<Link
				href='/profile'
				className='p-4 flex items-center gap-3 cursor-pointer group hover:bg-muted-foreground/5 transition-colors'
			>
				{user?.photo_url ? (
					<UserAvatar src={user.photo_url} alt={user.first_name} size='md' />
				) : (
					<div className='w-11 h-11 rounded-full bg-muted-foreground/10 flex items-center justify-center'>
						<UserCircleIcon className='w-7 h-7 text-muted-foreground' />
					</div>
				)}

				<div className='flex-1 min-w-0'>
					<p className='text-base leading-[22px] mb-1 font-medium truncate'>
						{user?.first_name} {user?.last_name}
					</p>
					{user?.username && (
						<p className='text-muted-foreground text-xs leading-4 font-medium truncate'>
							@{user.username}
						</p>
					)}
				</div>
				<ChevronRightIcon
					width={24}
					height={24}
					className='transition-transform duration-200 group-hover:translate-x-1 text-muted-foreground shrink-0'
				/>
			</Link>
			<Separator />
			<nav className='flex flex-col gap-2 p-4'>
				{links.map(({ href, label, icon: Icon }) => {
					const active = pathname === href
					return (
						<Link
							key={href}
							href={href}
							className={cn(
								'flex items-center gap-2 p-2 rounded-2xl transition-colors hover:bg-muted-foreground/5',
								active && 'bg-muted-foreground/10 font-medium'
							)}
						>
							<Icon width={24} height={24} className='text-muted-foreground' />
							{label}
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import {
	ChevronRightIcon,
	CubeIcon,
	HomeIcon,
	QuestionMarkCircleIcon,
} from '@heroicons/react/24/solid'

const links = [
	{ href: '/dashboard', label: 'Главная', icon: HomeIcon },
	{ href: '/clusters', label: 'Кластеры PostgreSQL', icon: CubeIcon },
	{ href: '/help', label: 'Центр поддержки', icon: QuestionMarkCircleIcon },
]

export function ProtectedSidebar() {
	const pathname = usePathname()

	return (
		<aside className='w-[280px] bg-muted border-r flex flex-col'>
			<div className='p-4 flex items-center gap-3 cursor-pointer group'>
				<svg
					width='44'
					height='44'
					viewBox='0 0 44 44'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<rect
						width='44'
						height='44'
						rx='22'
						fill='#A9ACB4'
						fillOpacity='0.12'
					/>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M21.988 24.406C19.3255 24.4255 11.218 24.481 11.2195 30.1885C11.329 32.4685 12.952 34 15.2605 34H28.7425C31.033 34 32.6545 32.47 32.7805 30.157C32.8045 24.508 24.6715 24.4315 21.988 24.406ZM22.0075 21.604C23.5458 21.6032 25.0209 20.9919 26.1087 19.9043C27.1966 18.8167 27.8083 17.3418 27.8095 15.8035C27.8079 14.2651 27.1962 12.7901 26.1085 11.7021C25.0208 10.6141 23.5459 10.002 22.0075 10C20.4688 10.002 18.9937 10.6143 17.906 11.7026C16.8183 12.7909 16.2067 14.2663 16.2055 15.805C16.2071 17.343 16.819 18.8176 17.9068 19.9048C18.9946 20.9921 20.4695 21.6032 22.0075 21.604Z'
						fill='#53575F'
					/>
				</svg>

				<div className='flex-1'>
					<p className='text-base leading-[22px] mb-1 font-medium'>Андрей</p>
					<p className='text-muted-foreground text-xs leading-4 font-medium'>
						@A_Grady
					</p>
				</div>
				<ChevronRightIcon
					width={24}
					height={24}
					className='transition-transform duration-200 group-hover:translate-x-1 text-muted-foreground'
				/>
			</div>
			<Separator />
			<nav className='flex flex-col gap-2 p-4'>
				{links.map(({ href, label, icon: Icon }) => {
					const active = pathname === href
					return (
						<Link
							key={href}
							href={href}
							className={cn(
								'flex items-center gap-2 p-2 rounded-2xl ',
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

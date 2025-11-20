'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
	src?: string
	alt: string
	size?: 'sm' | 'md' | 'lg'
	className?: string
}

const sizeClasses = {
	sm: 'w-8 h-8',
	md: 'w-11 h-11',
	lg: 'w-16 h-16',
}

const iconSizeClasses = {
	sm: 'w-5 h-5',
	md: 'w-7 h-7',
	lg: 'w-10 h-10',
}

export function UserAvatar({
	src,
	alt,
	size = 'md',
	className,
}: UserAvatarProps) {
	return (
		<Avatar className={cn(sizeClasses[size], className)}>
			<AvatarImage src={src} alt={alt} className='object-cover' />
			<AvatarFallback className='bg-muted-foreground/10'>
				<UserCircleIcon
					className={cn(iconSizeClasses[size], 'text-muted-foreground')}
				/>
			</AvatarFallback>
		</Avatar>
	)
}

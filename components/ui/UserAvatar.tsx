'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { UserRound } from 'lucide-react'

interface UserAvatarProps {
	size?: 'sm' | 'md' | 'lg'
	className?: string
}

const sizeClasses = {
	sm: 'w-8 h-8',
	md: 'w-11 h-11',
	lg: 'w-16 h-16',
}

const iconSizeClasses = {
	sm: 'w-4 h-4',
	md: 'w-6 h-6',
	lg: 'w-8 h-8',
}

export function UserAvatar({ size = 'md', className }: UserAvatarProps) {
	return (
		<Avatar className={cn(sizeClasses[size], className)}>
			<AvatarFallback className='bg-muted'>
				<UserRound
					className={cn(iconSizeClasses[size], 'text-muted-foreground')}
				/>
			</AvatarFallback>
		</Avatar>
	)
}

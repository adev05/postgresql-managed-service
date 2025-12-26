'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { ClockIcon, UserIcon } from '@heroicons/react/24/outline'
import { HyperVHostAuditLog } from '@/types/hyperv-host'
import { getHyperVHostAuditLogs } from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface HyperVHostAuditLogsProps {
	hostId: number
}

export default function HyperVHostAuditLogs({
	hostId,
}: HyperVHostAuditLogsProps) {
	const { data: session } = useSession()
	const [logs, setLogs] = React.useState<HyperVHostAuditLog[]>([])
	const [isLoading, setIsLoading] = React.useState(true)
	const [error, setError] = React.useState<string | null>(null)

	React.useEffect(() => {
		const fetchLogs = async () => {
			if (!session?.access_token) return

			setIsLoading(true)
			setError(null)

			try {
				const auditLogs = await getHyperVHostAuditLogs(
					session.access_token,
					hostId
				)
				setLogs(auditLogs)
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: 'Не удалось загрузить логи аудита'
				)
			} finally {
				setIsLoading(false)
			}
		}

		fetchLogs()
	}, [hostId, session?.access_token])

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const now = new Date()
		const diffMs = now.getTime() - date.getTime()
		const diffMins = Math.floor(diffMs / 60000)
		const diffHours = Math.floor(diffMs / 3600000)
		const diffDays = Math.floor(diffMs / 86400000)

		if (diffMins < 1) return 'только что'
		if (diffMins < 60) return `${diffMins} мин. назад`
		if (diffHours < 24) return `${diffHours} ч. назад`
		if (diffDays < 7) return `${diffDays} д. назад`

		return date.toLocaleString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-8'>
				<Spinner />
				<span className='ml-3 text-sm text-muted-foreground'>
					Загрузка логов...
				</span>
			</div>
		)
	}

	if (error) {
		return (
			<div className='py-6 px-4 text-center'>
				<p className='text-sm text-destructive'>{error}</p>
			</div>
		)
	}

	if (logs.length === 0) {
		return (
			<div className='py-8 px-4 text-center'>
				<p className='text-sm text-muted-foreground'>Логи аудита отсутствуют</p>
			</div>
		)
	}

	return (
		<ScrollArea className='h-[400px] w-full'>
			<div className='space-y-3 p-4'>
				{logs.map(log => (
					<Card
						key={log.id}
						className='p-4 hover:bg-muted/50 transition-colors border-l-4 border-l-primary/20'
					>
						<div className='flex items-start justify-between gap-4'>
							<div className='flex-1 space-y-2'>
								<div className='flex items-center gap-2 flex-wrap'>
									<Badge variant='outline' className='text-xs'>
										<UserIcon className='w-3 h-3 mr-1' />
										ID: {log.user_id}
									</Badge>
									<Badge variant='secondary' className='text-xs'>
										<ClockIcon className='w-3 h-3 mr-1' />
										{formatDate(log.created_at)}
									</Badge>
								</div>
								<p className='text-sm leading-relaxed text-foreground'>
									{log.log}
								</p>
							</div>
						</div>
					</Card>
				))}
			</div>
		</ScrollArea>
	)
}

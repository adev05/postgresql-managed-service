'use client'

import React from 'react'
import { redirect } from 'next/navigation'

interface AdminErrorProps {
	error: Error
	reset: () => void
}

export default function AdminError({ error, reset }: AdminErrorProps) {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center max-w-md">
				<div className="mb-4 text-6xl">🔒</div>
				<h1 className="text-2xl font-bold mb-2">Доступ запрещён</h1>
				<p className="text-muted-foreground mb-6">
					У вас нет прав доступа к административной панели. Это действие зафиксировано.
				</p>
				<button
					onClick={() => (window.location.href = '/dashboard')}
					className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
				>
					Вернуться на Dashboard
				</button>
			</div>
		</div>
	)
}

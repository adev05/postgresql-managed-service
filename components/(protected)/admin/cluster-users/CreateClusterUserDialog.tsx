'use client'

import React, { useState } from 'react'
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreateClusterUserPayload, ClusterUser } from '@/types/cluster-user'
import { createClusterUser } from '@/actions/cluster-user'
import { Plus } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

const INITIAL_FORM: CreateClusterUserPayload = {
	username: '',
	permissions: '',
}

const AVAILABLE_PERMISSIONS = [
	{ value: 'CREATE', label: 'CREATE' },
	{ value: 'CONNECT', label: 'CONNECT' },
	{ value: 'TEMPORARY', label: 'TEMPORARY' },
]

interface CreateClusterUserDialogProps {
	clusterId: string
	onUserCreated?: (user: ClusterUser) => void
}

export default function CreateClusterUserDialog({
	clusterId,
	onUserCreated,
}: CreateClusterUserDialogProps) {
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [form, setForm] = useState<CreateClusterUserPayload>(INITIAL_FORM)
	const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

	const updateField = <K extends keyof CreateClusterUserPayload>(
		key: K,
		value: CreateClusterUserPayload[K]
	) => {
		setForm(prev => ({ ...prev, [key]: value }))
	}

	const handlePermissionToggle = (permission: string) => {
		setSelectedPermissions(prev => {
			const newPerms = prev.includes(permission)
				? prev.filter(p => p !== permission)
				: [...prev, permission]

			updateField('permissions', newPerms.join(','))
			return newPerms
		})
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)

		if (!form.username.trim()) {
			setError('Имя пользователя обязательно')
			setLoading(false)
			return
		}

		if (!form.permissions.trim()) {
			setError('Выберите хотя бы одно разрешение')
			setLoading(false)
			return
		}

		try {
			const newUser = await createClusterUser(clusterId, form)
			setOpen(false)
			setForm(INITIAL_FORM)
			setSelectedPermissions([])

			if (onUserCreated) {
				onUserCreated(newUser)
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Ошибка при создании пользователя'
			)
		} finally {
			setLoading(false)
		}
	}

	const handleOpenChange = (newOpen: boolean) => {
		if (!loading) {
			setOpen(newOpen)
			if (!newOpen) {
				setError(null)
				setForm(INITIAL_FORM)
				setSelectedPermissions([])
			}
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant='outline'>
					<Plus />
					<span className='hidden lg:inline'>Создать пользователя</span>
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[500px]'>
				<DialogHeader>
					<DialogTitle>Создание пользователя кластера</DialogTitle>
					<DialogDescription>
						Укажите имя пользователя и выберите разрешения.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='grid gap-4 py-4'>
					<div className='space-y-2'>
						<Label htmlFor='username'>
							Имя пользователя <span className='text-destructive'>*</span>
						</Label>
						<Input
							id='username'
							value={form.username}
							onChange={e => updateField('username', e.target.value)}
							placeholder='user_name'
							disabled={loading}
							required
						/>
					</div>

					<div className='space-y-3'>
						<Label>
							Разрешения <span className='text-destructive'>*</span>
						</Label>
						<div className='space-y-2'>
							{AVAILABLE_PERMISSIONS.map(perm => (
								<div key={perm.value} className='flex items-center space-x-2'>
									<Checkbox
										id={perm.value}
										checked={selectedPermissions.includes(perm.value)}
										onCheckedChange={() => handlePermissionToggle(perm.value)}
										disabled={loading}
									/>
									<label
										htmlFor={perm.value}
										className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
									>
										{perm.label}
									</label>
								</div>
							))}
						</div>
						{form.permissions && (
							<p className='text-xs text-muted-foreground'>
								Выбрано: {form.permissions}
							</p>
						)}
					</div>

					{error && (
						<div className='text-sm text-destructive bg-destructive/10 p-3 rounded-md'>
							{error}
						</div>
					)}

					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							onClick={() => handleOpenChange(false)}
							disabled={loading}
						>
							Отмена
						</Button>
						<Button type='submit' disabled={loading}>
							{loading ? 'Создание...' : 'Создать'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

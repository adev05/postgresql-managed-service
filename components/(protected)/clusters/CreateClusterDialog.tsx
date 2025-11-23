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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Cluster, ClusterResponse, CreateClusterPayload } from '@/types/cluster'
import { createCluster } from '@/actions/cluster'

const INITIAL_FORM: CreateClusterPayload = {
	name: '',
	pg_version: '16',
	cpu: 2,
	ram_mb: 1024,
	storage_gb: 10,
}

const PG_VERSIONS = ['18', '17', '16'] as const

interface CreateClusterDialogProps {
	onClusterCreated?: (cluster: ClusterResponse) => void
}

export default function CreateClusterDialog({
	onClusterCreated,
}: CreateClusterDialogProps) {
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [form, setForm] = useState<CreateClusterPayload>(INITIAL_FORM)

	const updateField = <K extends keyof CreateClusterPayload>(
		key: K,
		value: CreateClusterPayload[K]
	) => {
		setForm(prev => ({ ...prev, [key]: value }))
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)
		try {
			const newCluster = await createCluster(form)
			onClusterCreated?.(newCluster)
			setOpen(false)
			setForm(INITIAL_FORM)

			if (onClusterCreated) {
				// toast.success('Кластер успешно создан!', {
				// 	action: {
				// 		label: 'Открыть',
				// 		onClick: () => router.push(`/clusters/${newCluster.id}`),
				// 	},
				// })
				onClusterCreated(newCluster)
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Ошибка при создании кластера'
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
			}
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant='outline' className='h-full'>
					Создать кластер
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[600px]'>
				<DialogHeader>
					<DialogTitle>Создание PostgreSQL кластера</DialogTitle>
					<DialogDescription>
						Заполните параметры и нажмите «Создать».
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='grid gap-4 py-4'>
					<div className='space-y-2'>
						<Label htmlFor='name'>Название кластера</Label>
						<Input
							id='name'
							value={form.name}
							onChange={e => updateField('name', e.target.value)}
							required
							placeholder='my-cluster'
							disabled={loading}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='pg_version'>Версия PostgreSQL</Label>
						<Select
							onValueChange={v => updateField('pg_version', v)}
							defaultValue={form.pg_version}
							disabled={loading}
						>
							<SelectTrigger id='pg_version' className='w-full'>
								<SelectValue placeholder='Выберите версию' />
							</SelectTrigger>
							<SelectContent>
								{PG_VERSIONS.map(v => (
									<SelectItem key={v} value={v}>
										{v}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='cpu'>CPU: {form.cpu}</Label>
						<Slider
							id='cpu'
							value={[form.cpu]}
							min={2}
							max={16}
							step={1}
							onValueChange={val => updateField('cpu', val[0])}
							disabled={loading}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='ram_mb'>RAM (MB): {form.ram_mb}</Label>
						<Slider
							id='ram_mb'
							value={[form.ram_mb]}
							min={1024}
							max={32768}
							step={1024}
							onValueChange={val => updateField('ram_mb', val[0])}
							disabled={loading}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='storage_gb'>Storage (GB): {form.storage_gb}</Label>
						<Slider
							id='storage_gb'
							value={[form.storage_gb]}
							min={10}
							max={512}
							step={1}
							onValueChange={val => updateField('storage_gb', val[0])}
							disabled={loading}
						/>
					</div>

					{error && <p className='text-sm text-destructive'>{error}</p>}

					<DialogFooter className='flex justify-between'>
						<Button type='submit' disabled={loading} variant='positive'>
							{loading ? 'Создаём...' : 'Создать'}
						</Button>
						<Button
							variant='secondary'
							type='button'
							onClick={() => handleOpenChange(false)}
							disabled={loading}
						>
							Отмена
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

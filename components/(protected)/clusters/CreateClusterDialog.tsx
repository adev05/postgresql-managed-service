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
import {
	createCluster,
	CreateClusterPayload,
} from '@/app/(protected)/clusters/actions'

const initialForm: CreateClusterPayload = {
	name: '',
	pg_version: '16',
	cpu: 2,
	ram_mb: 1024,
	storage_gb: 25,
}

export default function CreateClusterDialog() {
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const [form, setForm] = useState<CreateClusterPayload>(initialForm)

	function update<K extends keyof CreateClusterPayload>(
		key: K,
		value: CreateClusterPayload[K]
	) {
		setForm(prev => ({ ...prev, [key]: value }))
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)
		try {
			await createCluster(form)
			setOpen(false)
			setForm(initialForm)
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Ошибка при создании кластера'
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='positive'>Создать кластер</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[600px]'>
				<DialogHeader>
					<DialogTitle>Создание PostgreSQL кластера</DialogTitle>
					<DialogDescription>
						Заполни параметры и нажми «Создать».
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='grid gap-4 py-4'>
					<div className='space-y-4'>
						<Label htmlFor='name'>Название кластера</Label>
						<Input
							id='name'
							value={form.name}
							onChange={e => update('name', e.target.value)}
							required
							placeholder='my-cluster'
						/>
					</div>

					<div className='space-y-4'>
						<Label htmlFor='pg_version'>Версия PostgreSQL</Label>
						<Select
							onValueChange={v => update('pg_version', v)}
							defaultValue={form.pg_version}
						>
							<SelectTrigger id='pg_version' className='w-full'>
								<SelectValue placeholder='Выберите версию' />
							</SelectTrigger>
							<SelectContent>
								{['18', '17', '16'].map(v => (
									<SelectItem key={v} value={v}>
										{v}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-4'>
						<Label htmlFor='cpu'>CPU: {form.cpu}</Label>
						<Slider
							id='cpu'
							value={[form.cpu]}
							min={2}
							max={16}
							step={1}
							onValueChange={val => update('cpu', val[0])}
						/>
					</div>

					<div className='space-y-4'>
						<Label htmlFor='ram_mb'>RAM (MB): {form.ram_mb}</Label>
						<Slider
							id='ram_mb'
							value={[form.ram_mb]}
							min={1024}
							max={32768}
							step={1024}
							onValueChange={val => update('ram_mb', val[0])}
						/>
					</div>

					<div className='space-y-4'>
						<Label htmlFor='storage_gb'>Storage (GB): {form.storage_gb}</Label>
						<Slider
							id='storage_gb'
							value={[form.storage_gb]}
							min={25}
							max={512}
							step={1}
							onValueChange={val => update('storage_gb', val[0])}
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
							onClick={() => setOpen(false)}
						>
							Отмена
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

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
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { CreateHyperVHostPayload, HyperVHost } from '@/types/hyperv-host'
import { createHyperVHost } from '@/actions/hyperv-host'
import { Plus } from 'lucide-react'

const INITIAL_FORM: CreateHyperVHostPayload = {
	host_fqdn: '',
	winrm_port: 5986,
	https: true,
	location: '',
	description: '',
	total_storage: 512,
	total_ram: 32768,
	total_cpu: 16,
	disks_path: 'C:\\Hyper-V',
	username: '',
	password: '',
}

interface CreateHyperVHostDialogProps {
	onHostCreated?: (host: HyperVHost) => void
}

export default function CreateHyperVHostDialog({
	onHostCreated,
}: CreateHyperVHostDialogProps) {
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [form, setForm] = useState<CreateHyperVHostPayload>(INITIAL_FORM)

	const updateField = <K extends keyof CreateHyperVHostPayload>(
		key: K,
		value: CreateHyperVHostPayload[K]
	) => {
		setForm(prev => ({ ...prev, [key]: value }))
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)
		try {
			const newHost = await createHyperVHost(form)
			setOpen(false)
			setForm(INITIAL_FORM)

			if (onHostCreated) {
				onHostCreated(newHost)
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Ошибка при создании хоста')
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
				<Button variant='outline'>
					<Plus />
					<span className='hidden lg:inline'>Создать хост</span>
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[600px]'>
				<DialogHeader>
					<DialogTitle>Создание Hyper-V хоста</DialogTitle>
					<DialogDescription>
						Заполните параметры подключения к хосту и нажмите «Создать».
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='grid gap-4 py-4'>
					<div className='space-y-2'>
						<Label htmlFor='host_fqdn'>IP адрес или домен *</Label>
						<Input
							id='host_fqdn'
							value={form.host_fqdn}
							onChange={e => updateField('host_fqdn', e.target.value)}
							required
							placeholder='192.168.1.100 или hyperv-host.example.com'
							disabled={loading}
						/>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='username'>Имя пользователя *</Label>
							<Input
								id='username'
								value={form.username}
								onChange={e => updateField('username', e.target.value)}
								required
								placeholder='administrator'
								disabled={loading}
								autoComplete='username'
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='password'>Пароль *</Label>
							<Input
								id='password'
								type='password'
								value={form.password}
								onChange={e => updateField('password', e.target.value)}
								required
								placeholder='••••••••'
								disabled={loading}
								autoComplete='current-password'
							/>
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='location'>Локация</Label>
						<Input
							id='location'
							value={form.location}
							onChange={e => updateField('location', e.target.value)}
							placeholder='Москва, Дата-центр 1'
							disabled={loading}
						/>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='winrm_port'>WinRM порт</Label>
							<Input
								id='winrm_port'
								type='number'
								value={form.winrm_port}
								onChange={e =>
									updateField('winrm_port', parseInt(e.target.value) || 5986)
								}
								required
								min={1}
								max={65535}
								disabled={loading}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='https' className='flex items-center gap-2'>
								<span>Использовать HTTPS</span>
							</Label>
							<div className='flex items-center h-10'>
								<Switch
									id='https'
									checked={form.https}
									onCheckedChange={value => updateField('https', value)}
									disabled={loading}
								/>
							</div>
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='disks_path'>Путь к дискам *</Label>
						<Input
							id='disks_path'
							value={form.disks_path}
							onChange={e => updateField('disks_path', e.target.value)}
							required
							placeholder='C:\Hyper-V'
							disabled={loading}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='total_cpu'>CPU (ядер): {form.total_cpu}</Label>
						<Slider
							id='total_cpu'
							value={[form.total_cpu]}
							min={2}
							max={64}
							step={2}
							onValueChange={val => updateField('total_cpu', val[0])}
							disabled={loading}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='total_ram'>RAM (MB): {form.total_ram}</Label>
						<Slider
							id='total_ram'
							value={[form.total_ram]}
							min={4096}
							max={131072}
							step={4096}
							onValueChange={val => updateField('total_ram', val[0])}
							disabled={loading}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='total_storage'>
							Storage (GB): {form.total_storage}
						</Label>
						<Slider
							id='total_storage'
							value={[form.total_storage]}
							min={100}
							max={10240}
							step={100}
							onValueChange={val => updateField('total_storage', val[0])}
							disabled={loading}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='description'>Описание</Label>
						<Textarea
							id='description'
							value={form.description}
							onChange={e => updateField('description', e.target.value)}
							placeholder='Дополнительная информация о хосте'
							disabled={loading}
							rows={3}
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

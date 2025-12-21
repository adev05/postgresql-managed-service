'use client'

import React, { useState, useEffect } from 'react'
import {
	Dialog,
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
import { updateHyperVHost } from '@/actions/hyperv-host'

interface EditHyperVHostDialogProps {
	host: HyperVHost
	open: boolean
	onOpenChange: (open: boolean) => void
	onHostUpdated?: (host: HyperVHost) => void
}

export default function EditHyperVHostDialog({
	host,
	open,
	onOpenChange,
	onHostUpdated,
}: EditHyperVHostDialogProps) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [form, setForm] = useState<CreateHyperVHostPayload>({
		host_fqdn: host.host_fqdn,
		winrm_port: host.winrm_port,
		https: host.https,
		location: host.location,
		description: host.description,
		total_storage: host.total_storage,
		total_ram: host.total_ram,
		total_cpu: host.total_cpu,
		disks_path: host.disks_path || 'C:\\Hyper-V',
	})

	// Обновляем форму при изменении хоста
	useEffect(() => {
		if (host) {
			setForm({
				host_fqdn: host.host_fqdn,
				winrm_port: host.winrm_port,
				https: host.https,
				location: host.location,
				description: host.description,
				total_storage: host.total_storage,
				total_ram: host.total_ram,
				total_cpu: host.total_cpu,
				disks_path: host.disks_path || 'C:\\Hyper-V',
			})
		}
	}, [host])

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
			const updatedHost = await updateHyperVHost(host.id, form)
			onOpenChange(false)

			if (onHostUpdated) {
				onHostUpdated(updatedHost)
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Ошибка при обновлении хоста'
			)
		} finally {
			setLoading(false)
		}
	}

	const handleOpenChangeInternal = (newOpen: boolean) => {
		if (!loading) {
			onOpenChange(newOpen)
			if (!newOpen) {
				setError(null)
			}
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChangeInternal}>
			<DialogContent className='sm:max-w-[600px]'>
				<DialogHeader>
					<DialogTitle>Редактирование Hyper-V хоста</DialogTitle>
					<DialogDescription>
						Обновите параметры хоста и нажмите «Сохранить».
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
							{loading ? 'Сохраняем...' : 'Сохранить'}
						</Button>
						<Button
							variant='secondary'
							type='button'
							onClick={() => handleOpenChangeInternal(false)}
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

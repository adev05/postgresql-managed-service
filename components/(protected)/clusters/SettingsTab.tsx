'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
	Settings,
	Save,
	Trash2,
	Power,
	RotateCcw,
	Shield,
	Database,
	AlertTriangle,
} from 'lucide-react'
import { useState } from 'react'

export default function SettingsTab() {
	const [clusterName, setClusterName] = useState('pg-cluster-01')
	const [maintenanceWindow, setMaintenanceWindow] = useState('sunday-03:00')
	const [autoMinorUpgrade, setAutoMinorUpgrade] = useState(true)
	const [publicAccess, setPublicAccess] = useState(false)
	const [sslMode, setSslMode] = useState('require')
	const [maxConnections, setMaxConnections] = useState('200')
	const [sharedBuffers, setSharedBuffers] = useState('2GB')
	const [workMem, setWorkMem] = useState('4MB')
	const [maintenanceWorkMem, setMaintenanceWorkMem] = useState('64MB')

	return (
		<div className='space-y-6'>
			{/* Общие настройки */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						Общие настройки
					</CardTitle>
					<CardDescription>Основные параметры кластера</CardDescription>
					<CardAction>
						<Settings className='h-4 w-4 text-muted-foreground' />
					</CardAction>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='cluster-name'>Название кластера</Label>
						<Input
							id='cluster-name'
							value={clusterName}
							onChange={e => setClusterName(e.target.value)}
							placeholder='Введите название кластера'
						/>
						<p className='text-sm text-muted-foreground'>
							Используется для идентификации в списке кластеров
						</p>
					</div>

					<Separator />

					<div className='space-y-2'>
						<Label htmlFor='maintenance-window'>Окно обслуживания</Label>
						<Select
							value={maintenanceWindow}
							onValueChange={setMaintenanceWindow}
						>
							<SelectTrigger id='maintenance-window'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='sunday-03:00'>Воскресенье 03:00</SelectItem>
								<SelectItem value='monday-03:00'>Понедельник 03:00</SelectItem>
								<SelectItem value='tuesday-03:00'>Вторник 03:00</SelectItem>
								<SelectItem value='wednesday-03:00'>Среда 03:00</SelectItem>
								<SelectItem value='thursday-03:00'>Четверг 03:00</SelectItem>
								<SelectItem value='friday-03:00'>Пятница 03:00</SelectItem>
								<SelectItem value='saturday-03:00'>Суббота 03:00</SelectItem>
							</SelectContent>
						</Select>
						<p className='text-sm text-muted-foreground'>
							Время для выполнения обновлений и обслуживания
						</p>
					</div>

					<div className='flex items-center justify-between'>
						<div className='space-y-0.5'>
							<Label>Автоматические минорные обновления</Label>
							<p className='text-sm text-muted-foreground'>
								Автоматически устанавливать патчи безопасности
							</p>
						</div>
						<Switch
							checked={autoMinorUpgrade}
							onCheckedChange={setAutoMinorUpgrade}
						/>
					</div>
				</CardContent>
				<CardFooter>
					<Button>
						<Save className='w-4 h-4 ' />
						Сохранить изменения
					</Button>
				</CardFooter>
			</Card>

			{/* Настройки безопасности */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						Безопасность
					</CardTitle>
					<CardDescription>Параметры доступа и шифрования</CardDescription>
					<CardAction>
						<Shield className='h-4 w-4 text-muted-foreground' />
					</CardAction>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='flex items-center justify-between'>
						<div className='space-y-0.5'>
							<Label>Публичный доступ</Label>
							<p className='text-sm text-muted-foreground'>
								Разрешить подключения из интернета
							</p>
						</div>
						<Switch checked={publicAccess} onCheckedChange={setPublicAccess} />
					</div>

					<Separator />

					<div className='space-y-2'>
						<Label htmlFor='ssl-mode'>Режим SSL</Label>
						<Select value={sslMode} onValueChange={setSslMode}>
							<SelectTrigger id='ssl-mode'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='disable'>Отключен</SelectItem>
								<SelectItem value='allow'>Разрешён</SelectItem>
								<SelectItem value='prefer'>Предпочтителен</SelectItem>
								<SelectItem value='require'>Обязателен</SelectItem>
								<SelectItem value='verify-ca'>Проверка CA</SelectItem>
								<SelectItem value='verify-full'>Полная проверка</SelectItem>
							</SelectContent>
						</Select>
						<p className='text-sm text-muted-foreground'>
							Уровень шифрования подключений к базе данных
						</p>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='allowed-ips'>Разрешённые IP-адреса</Label>
						<Textarea
							id='allowed-ips'
							placeholder='192.168.1.0/24&#10;10.0.0.0/8'
							rows={4}
							className='font-mono text-sm'
						/>
						<p className='text-sm text-muted-foreground'>
							CIDR-нотация, по одному на строку
						</p>
					</div>
				</CardContent>
				<CardFooter>
					<Button>
						<Save className='w-4 h-4' />
						Сохранить настройки безопасности
					</Button>
				</CardFooter>
			</Card>

			{/* Настройки производительности */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						Производительность
					</CardTitle>
					<CardDescription>Конфигурация PostgreSQL</CardDescription>
					<CardAction>
						<Database className='h-4 w-4 text-muted-foreground' />
					</CardAction>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='max-connections'>max_connections</Label>
							<Input
								id='max-connections'
								value={maxConnections}
								onChange={e => setMaxConnections(e.target.value)}
							/>
							<p className='text-sm text-muted-foreground'>
								Максимум одновременных подключений
							</p>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='shared-buffers'>shared_buffers</Label>
							<Input
								id='shared-buffers'
								value={sharedBuffers}
								onChange={e => setSharedBuffers(e.target.value)}
							/>
							<p className='text-sm text-muted-foreground'>
								Размер разделяемого буфера памяти
							</p>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='work-mem'>work_mem</Label>
							<Input
								id='work-mem'
								value={workMem}
								onChange={e => setWorkMem(e.target.value)}
							/>
							<p className='text-sm text-muted-foreground'>
								Память для операций сортировки
							</p>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='maintenance-work-mem'>maintenance_work_mem</Label>
							<Input
								id='maintenance-work-mem'
								value={maintenanceWorkMem}
								onChange={e => setMaintenanceWorkMem(e.target.value)}
							/>
							<p className='text-sm text-muted-foreground'>
								Память для операций обслуживания
							</p>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button>
						<Save className='w-4 h-4' />
						Применить параметры
					</Button>
				</CardFooter>
			</Card>

			{/* Управление кластером */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						Управление кластером
					</CardTitle>
					<CardDescription>
						Операции остановки, перезапуска и удаления
					</CardDescription>
					<CardAction>
						<Power className='h-4 w-4 text-muted-foreground' />
					</CardAction>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='flex items-center justify-between p-4 border rounded-lg'>
						<div>
							<p className='font-medium'>Перезапустить кластер</p>
							<p className='text-sm text-muted-foreground'>
								Применить изменения конфигурации
							</p>
						</div>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant='outline'>
									<RotateCcw className='w-4 h-4' />
									Перезапустить
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Перезапустить кластер?</AlertDialogTitle>
									<AlertDialogDescription>
										Кластер будет недоступен на несколько минут. Все активные
										подключения будут разорваны.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Отмена</AlertDialogCancel>
									<AlertDialogAction>Перезапустить</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>

					<div className='flex items-center justify-between p-4 border rounded-lg'>
						<div>
							<p className='font-medium'>Остановить кластер</p>
							<p className='text-sm text-muted-foreground'>
								Временная приостановка работы кластера
							</p>
						</div>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant='outline'>
									<Power className='w-4 h-4' />
									Остановить
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Остановить кластер?</AlertDialogTitle>
									<AlertDialogDescription>
										Кластер будет остановлен и недоступен до повторного запуска.
										Взимание платы за ресурсы будет приостановлено.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Отмена</AlertDialogCancel>
									<AlertDialogAction>Остановить</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</CardContent>
			</Card>

			{/* Опасная зона */}
			<Card className='border-destructive'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2 text-destructive'>
						<AlertTriangle className='w-5 h-5' />
						Опасная зона
					</CardTitle>
					<CardDescription>Необратимые действия с кластером</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex items-center justify-between p-4 border border-destructive rounded-lg bg-destructive/5'>
						<div>
							<p className='font-medium text-destructive'>Удалить кластер</p>
							<p className='text-sm text-muted-foreground'>
								Безвозвратно удалить кластер и все данные
							</p>
						</div>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant='destructive'>
									<Trash2 className='w-4 h-4' />
									Удалить кластер
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Удалить кластер навсегда?</AlertDialogTitle>
									<AlertDialogDescription>
										Это действие необратимо. Все базы данных, пользователи,
										резервные копии и настройки будут безвозвратно удалены.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Отмена</AlertDialogCancel>
									<AlertDialogAction className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
										Да, удалить навсегда
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

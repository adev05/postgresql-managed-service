import BackupsTab from '@/components/(protected)/clusters/BackupsTab'
import ConnectionsTab from '@/components/(protected)/clusters/ConnectionsTab'
import DatabaseTab from '@/components/(protected)/clusters/DatabaseTab'
import LogsTab from '@/components/(protected)/clusters/LogsTab'
import MonitoringTab from '@/components/(protected)/clusters/MonitoringTab'
import OverviewTab from '@/components/(protected)/clusters/OverviewTab'
import SettingsTab from '@/components/(protected)/clusters/SettingsTab'
import UsersTab from '@/components/(protected)/clusters/UsersTab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function ClusterPage() {
	return (
		<section className='px-4 lg:px-6'>
			<Tabs defaultValue='overview'>
				<TabsList className='*:px-4 mb-4 flex-wrap'>
					<TabsTrigger value='overview'>Обзор</TabsTrigger>
					<TabsTrigger value='databases'>Базы данных</TabsTrigger>
					<TabsTrigger value='users'>Пользователи</TabsTrigger>
					<TabsTrigger value='backups'>Резервные копии</TabsTrigger>
					<TabsTrigger value='monitoring'>Мониторинг</TabsTrigger>
					<TabsTrigger value='logs'>Журналы</TabsTrigger>
					<TabsTrigger value='connections'>Подключения</TabsTrigger>
					<TabsTrigger value='settings'>Настройки</TabsTrigger>
				</TabsList>

				<TabsContent value='overview'>
					<OverviewTab />
				</TabsContent>

				<TabsContent value='databases'>
					<DatabaseTab />
				</TabsContent>

				<TabsContent value='users'>
					<UsersTab />
				</TabsContent>

				<TabsContent value='backups'>
					<BackupsTab />
				</TabsContent>

				<TabsContent value='monitoring'>
					<MonitoringTab />
				</TabsContent>

				<TabsContent value='logs'>
					<LogsTab />
				</TabsContent>

				<TabsContent value='connections'>
					<ConnectionsTab />
				</TabsContent>

				<TabsContent value='settings'>
					<SettingsTab />
				</TabsContent>
			</Tabs>
		</section>
	)
}

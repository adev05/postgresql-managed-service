import { getCurrentUser } from '@/lib/auth-roles'
import { isAdminLevel } from '@/lib/permissions'

export interface SidebarLink {
	href: string
	label: string
	icon?: string
	isAdmin?: boolean
}

/**
 * Получает список ссылок для сайдбара с учётом permission_level пользователя
 */
export async function getSidebarLinks(): Promise<SidebarLink[]> {
	const user = await getCurrentUser()
	const isAdmin = isAdminLevel(user?.permission_level)

	const links: SidebarLink[] = [
		{
			href: '/dashboard',
			label: 'Dashboard',
			icon: 'dashboard',
		},
		{
			href: '/clusters',
			label: 'Clusters',
			icon: 'database',
		},
		{
			href: '/search',
			label: 'Search',
			icon: 'search',
		},
		{
			href: '/help',
			label: 'Help',
			icon: 'help-circle',
		},
		{
			href: '/settings',
			label: 'Settings',
			icon: 'settings',
		},
	]

	// Добавляем админ-ссылки, если пользователь админ
	if (isAdmin) {
		links.push({
			href: '/admin',
			label: 'Admin Panel',
			icon: 'shield-admin',
			isAdmin: true,
		})
	}

	return links
}

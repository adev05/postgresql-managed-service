import { HyperVHostStatusKey } from '@/constants/hyperVHostStatuses'

export interface HyperVHostStatus {
	id: number
	status: HyperVHostStatusKey
	description: string
}

export interface HyperVHost {
	host_fqdn: string
	winrm_port: number
	https: boolean
	location: string
	description: string
	total_storage: number
	total_ram: number
	total_cpu: number
	id: number
	status: HyperVHostStatus
	free_storage: number
	free_ram: number
	free_cpu: number
	created_at: string
	updated_at: string
	deleted_at: string
}

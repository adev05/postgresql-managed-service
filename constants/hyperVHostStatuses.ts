export const HYPERVHOST_STATUS = {
	ON_SERVICE: { label: 'На обслуживании', variant: 'creating' },
	IN_USING: { label: 'Работает', variant: 'running' },
	DISABLED: { label: 'Отключён', variant: 'failed' },
	DELETED: { label: 'Удалён', variant: 'stopped' },
} as const

export type HyperVHostStatusKey = keyof typeof HYPERVHOST_STATUS

// Маппинг статусов на их ID в базе данных
export const HYPERVHOST_STATUS_ID_MAP: Record<HyperVHostStatusKey, number> = {
	ON_SERVICE: 0,
	IN_USING: 1,
	DISABLED: 2,
	DELETED: 3,
}

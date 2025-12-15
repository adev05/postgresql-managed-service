export const HYPERVHOST_STATUS = {
	ON_SERVICE: { label: 'На обслуживании', variant: 'creating' },
	IN_USING: { label: 'Работает', variant: 'running' },
	DISABLED: { label: 'Отключён', variant: 'failed' },
	DELETED: { label: 'Удалён', variant: 'stopped' },
} as const

export type HyperVHostStatusKey = keyof typeof HYPERVHOST_STATUS

export const CLUSTER_STATUS = {
	CREATING: { label: 'Создаётся', variant: 'creating' },
	RUNNING: { label: 'Запущен', variant: 'running' },
	FAILED: { label: 'Ошибка', variant: 'failed' },
	STOPPED: { label: 'Остановлен', variant: 'stopped' },
	DELETING: { label: 'Удаляется', variant: 'deleting' },
	DELETED: { label: 'Удалён', variant: 'deleted' },
	STARTING: { label: 'Запускается', variant: 'starting' },
} as const

export type ClusterStatusKey = keyof typeof CLUSTER_STATUS
export type ClusterStatusVariant =
	(typeof CLUSTER_STATUS)[ClusterStatusKey]['variant']

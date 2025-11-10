export const CLUSTER_STATUS = {
	CREATING: { label: 'Создаётся', color: 'bg-yellow-500' },
	RUNNING: { label: 'Запущен', color: 'bg-green-500' },
	FAILED: { label: 'Ошибка', color: 'bg-red-500' },
	STOPPED: { label: 'Остановлен', color: 'bg-gray-500' },
	DELETING: { label: 'Удаляется', color: 'bg-orange-500' },
	DELETED: { label: 'Удалён', color: 'bg-gray-400' },
	STARTING: { label: 'Запускается', color: 'bg-blue-500' },
} as const

export type ClusterStatusKey = keyof typeof CLUSTER_STATUS

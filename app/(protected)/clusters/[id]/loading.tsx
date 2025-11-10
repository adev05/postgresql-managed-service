export default function ClusterLoading() {
	return (
		<div className='space-y-4 animate-pulse'>
			<div className='h-10 bg-secondary rounded w-1/3' />
			<div className='space-y-2'>
				<div className='h-6 bg-secondary rounded w-1/4' />
				<div className='h-32 bg-secondary rounded' />
			</div>
			<div className='space-y-2'>
				<div className='h-6 bg-secondary rounded w-1/4' />
				<div className='h-48 bg-secondary rounded' />
			</div>
		</div>
	)
}

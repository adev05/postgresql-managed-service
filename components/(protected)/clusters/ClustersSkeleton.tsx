export default function ClustersSkeleton() {
	return (
		<section className='grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className='p-4 gap-4 bg-secondary rounded-2xl flex items-center justify-between animate-pulse'
				>
					<div className='w-full space-y-2'>
						<div className='h-6 bg-muted rounded w-3/4' />
						<div className='space-y-1'>
							<div className='h-4 bg-muted rounded w-full' />
							<div className='h-4 bg-muted rounded w-full' />
							<div className='h-4 bg-muted rounded w-full' />
						</div>
					</div>
					<div className='w-6 h-6 bg-muted rounded shrink-0' />
				</div>
			))}
		</section>
	)
}

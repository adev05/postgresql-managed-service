import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import SessionProvider from '@/components/(protected)/SessionProvider'

const montserrat = Montserrat({
	variable: '--font-montserrat',
	subsets: ['cyrillic', 'latin'],
})

export const metadata: Metadata = {
	title: 'SkyDevs',
	description: 'SkyDevs project',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${montserrat.className} antialiased`}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<NextAuthSessionProvider>
						<SessionProvider>{children}</SessionProvider>
					</NextAuthSessionProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}

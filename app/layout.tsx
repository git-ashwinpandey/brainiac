import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { SessionProvider } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Providers from '@/components/Providers'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Brainiac',
	description: 'A AI based QUIZ game',
}

const queryClient = new QueryClient()

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={cn(inter.className, 'antialiased min-h-screen')}>
				<Providers>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem>
						<SessionProvider>
							<div className=''>
								<Navbar />
								{children}
							</div>
						</SessionProvider>
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	)
}

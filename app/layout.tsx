import type { Metadata } from 'next'; 
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'AttTracker Admin',
  description: 'Employee Attendance Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
     <html lang="en" suppressHydrationWarning>
     <body suppressHydrationWarning className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>{children}</Providers>
        {/* <Analytics /> */}
      </body>
    </html>
  )
}

<<<<<<< HEAD
import type { Metadata } from 'next'; 
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
// import { Analytics } from '@vercel/analytics/next';
import { Providers } from './providers';
import { AuthWrapper } from '@/components/AuthWrapper';
import './globals.css';
=======
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
>>>>>>> 27b1654c0b7638702363ce27036efb1ee4b7161a

export const metadata: Metadata = {
  title: "AttTracker - Construction Site Attendance Management",
  description:
    "Streamline construction site attendance tracking with AttTracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
     <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>
          <AuthWrapper>{children}</AuthWrapper>
        </Providers>
        {/* <Analytics /> */}
=======
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
        <Analytics />
>>>>>>> 27b1654c0b7638702363ce27036efb1ee4b7161a
      </body>
    </html>
  );
}

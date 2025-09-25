"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Layout } from "@/components/layout/Layout"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Layout>{children}</Layout>
    </ThemeProvider>
  )
}
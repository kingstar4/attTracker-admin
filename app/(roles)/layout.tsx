import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout/Layout";
import { Suspense } from "react";
import Loading from "@/features/loading-state/Loading";
// Global CSS is imported once at app/layout.tsx

export const metadata: Metadata = {
  title: "AttTracker Admin",
  description: "Employee Attendance Management System",
};

export default function RoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        suppressHydrationWarning
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Loading mode="page" />}>
            <Layout>{children}</Layout>
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </div>
    </>
  );
}

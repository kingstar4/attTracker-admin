import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
// Global CSS is imported once at app/layout.tsx

export const metadata: Metadata = {
  title: "WorkTrackr - Smart Attendance for Construction Teams",
  description:
    "Modern attendance tracking system for construction companies. Track attendance, manage employees, and monitor projects in real-time.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
      <Suspense fallback={null}>{children}</Suspense>
      <Analytics />
    </div>
  );
}

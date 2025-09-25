"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { ThreeJSHeader } from "./ThreeJSHeader"
import { useMediaQuery } from "@/hooks/use-mobile"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div className="min-h-screen bg-background">
      {/* <ThreeJSHeader /> */}
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />

        <main className={`flex-1 transition-all duration-300 ${!isMobile ? "ml-64" : ""}`}>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

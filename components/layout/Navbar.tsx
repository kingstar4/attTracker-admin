"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./ThemeToggle"
import { CurrentTime } from "./CurrentTime"
import { AdminMenu } from "./AdminMenu"

interface NavbarProps {
  onMenuClick: () => void
  sidebarOpen: boolean
}

export function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onMenuClick} className="md:hidden" aria-label="Toggle menu">
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="text-xl font-semibold text-foreground">Admin Console</h1>
        </div>

        <div className="flex items-center gap-2">
          <CurrentTime />
          <ThemeToggle />
          <AdminMenu />
        </div>
      </div>
    </nav>
  )
}

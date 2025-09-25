"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ScanFace, Fingerprint, Clock, Users, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  open: boolean
  onClose: () => void
  isMobile: boolean
}

const navigation = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: ScanFace, label: "Kiosk (Clock In/Out)", to: "/kiosk" },
  { icon: Fingerprint, label: "Enrollment", to: "/enrollment" },
  { icon: Clock, label: "Live Attendance", to: "/attendance" },
  { icon: Users, label: "Employees", to: "/employees" },
  { icon: Settings, label: "Settings", to: "/settings" },
]

export function Sidebar({ open, onClose, isMobile }: SidebarProps) {
  if (isMobile) {
    return (
      <>
        {/* Mobile backdrop */}
        {open && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />}

        {/* Mobile sidebar */}
        <div
          className={cn(
            "fixed left-0 top-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 md:hidden",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <h2 className="text-lg font-semibold text-sidebar-foreground">Menu</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <SidebarContent onItemClick={onClose} />
        </div>
      </>
    )
  }

  return (
    <div className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-sidebar-border">
      <SidebarContent />
    </div>
  )
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()
  
  return (
    <nav className="p-4 space-y-2">
      {navigation.map((item) => {
        const isActive = pathname === item.to
        return (
          <Link
            key={item.to}
            href={item.to}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

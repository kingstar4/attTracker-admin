"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigation } from "@/config/navigate";
import { useUserStore } from "@/store/useUserStore"; // hypothetical Zustand store

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export function Sidebar({ open, onClose, isMobile }: SidebarProps) {
  const { role } = useUserStore(); // "owner" | "supervisor" | "employee"

  // Null Check for role
  if (role) {
    const navItems = navigation[role];
    console.log(navItems);
  }
  const navItems = role ? navigation[role] : [];

  if (isMobile) {
    return (
      <>
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={onClose}
          />
        )}

        <div
          className={cn(
            "fixed left-0 top-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 md:hidden",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              Menu
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <SidebarContent navItems={navItems} onItemClick={onClose} />
        </div>
      </>
    );
  }

  return (
    <div className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-sidebar-border">
      <SidebarContent navItems={navItems} />
    </div>
  );
}

function SidebarContent({
  navItems,
  onItemClick,
}: {
  navItems: { icon: any; label: string; to: string }[];
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="p-4 space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            href={item.to}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

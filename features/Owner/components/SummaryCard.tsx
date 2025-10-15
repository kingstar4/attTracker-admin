"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export function SummaryCard({
  title,
  value,
  icon,
  className,
  subtitle,
}: {
  title: string
  value: string | number
  icon: ReactNode
  subtitle?: string
  className?: string
}) {
  return (
    <Card className={cn("p-4 sm:p-5 hover:shadow-lg transition-shadow", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {subtitle ? <p className="text-xs text-muted-foreground mt-1">{subtitle}</p> : null}
        </div>
        <div className="rounded-lg bg-muted p-3 text-muted-foreground">{icon}</div>
      </div>
    </Card>
  )
}


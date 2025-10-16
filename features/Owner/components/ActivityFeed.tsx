"use client"

import { Card } from "@/components/ui/card"
import { Clock4, UserPlus, Wrench } from "lucide-react"

export interface ActivityItem {
  id: string
  type: "attendance" | "employee" | "project"
  message: string
  timestamp: string
}

const typeIcon = {
  attendance: Clock4,
  employee: UserPlus,
  project: Wrench,
} as const

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Recent Activity</h3>
        <p className="text-xs text-muted-foreground">Latest updates across the organization</p>
      </div>
      <div className="space-y-4">
        {items.map((it) => {
          const Icon = typeIcon[it.type]
          return (
            <div key={it.id} className="flex gap-3">
              <div className="mt-[2px]">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm">{it.message}</p>
                <p className="text-xs text-muted-foreground">{new Date(it.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}


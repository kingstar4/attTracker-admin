"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEmployeeStore } from "@/store/employee-store"
import { Calendar, Clock, AlertTriangle } from "lucide-react"

export function StatsCards() {
  const { attendanceRecords } = useEmployeeStore()

  // Calculate stats
  const presentDays = attendanceRecords.filter((record) => record.status === "present").length
  const absentDays = attendanceRecords.filter((record) => record.status === "absent").length
  const lateDays = attendanceRecords.filter((record) => record.status === "late").length

  const stats = [
    {
      label: "Days Present",
      value: presentDays,
      icon: Calendar,
      colorClass: "text-present",
      bgClass: "bg-present/10",
    },
    {
      label: "Absent Days",
      value: absentDays,
      icon: AlertTriangle,
      colorClass: "text-absent",
      bgClass: "bg-absent/10",
    },
    {
      label: "Late Arrivals",
      value: lateDays,
      icon: Clock,
      colorClass: "text-late",
      bgClass: "bg-late/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgClass}`}>
                <Icon className={`h-4 w-4 ${stat.colorClass}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.colorClass}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

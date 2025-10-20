"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEmployeeModuleStore } from "@/store/useEmployeeModuleStore"
import { CalendarCheck, CalendarRange, ClipboardList, Percent } from "lucide-react"

export function StatsCards() {
  const { attendanceSummary, leaveRequests, dashboardLoading } = useEmployeeModuleStore()

  if (dashboardLoading && !attendanceSummary) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-8 w-8 bg-muted rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const attendancePercentage = attendanceSummary?.attendancePercentage ?? 0
  const daysPresent = attendanceSummary?.daysPresentThisMonth ?? 0
  const workingDays = attendanceSummary?.totalWorkingDays ?? 0
  const pendingLeaves = leaveRequests.filter((leave) => leave.status === "pending").length

  const stats = [
    {
      label: "Attendance Rate",
      value: `${attendancePercentage.toFixed(1)}%`,
      icon: Percent,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      footer: "Current month",
    },
    {
      label: "Days Present",
      value: daysPresent,
      icon: CalendarCheck,
      colorClass: "text-present",
      bgClass: "bg-present/10",
      footer: "This month",
    },
    {
      label: "Working Days",
      value: workingDays,
      icon: CalendarRange,
      colorClass: "text-muted-foreground",
      bgClass: "bg-muted/20",
      footer: "Scheduled days",
    },
    {
      label: "Pending Leaves",
      value: pendingLeaves,
      icon: ClipboardList,
      colorClass: pendingLeaves > 0 ? "text-navbar" : "text-muted-foreground",
      bgClass: pendingLeaves > 0 ? "bg-navbar/10" : "bg-muted/20",
      footer: "Awaiting approval",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
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
              <p className="text-xs text-muted-foreground">{stat.footer}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

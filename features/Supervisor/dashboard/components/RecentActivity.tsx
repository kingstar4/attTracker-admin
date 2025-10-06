"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ArrowRight } from "lucide-react"
import { useAttendanceStore } from "@/store/useAttendanceStore"
import { Button } from "@/components/ui/button"

export function RecentActivity() {
  const { attendanceRecords, employees } = useAttendanceStore()

  const getActionIcon = (action: string) => {
    switch (action) {
      case "clock-in":
        return "🟢"
      case "clock-out":
        return "🔴"
      case "break-start":
        return "🟡"
      case "break-end":
        return "🟢"
      default:
        return "⚪"
    }
  }

  const formatAction = (action: string) => {
    return action
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-xs">
          View All
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {attendanceRecords
            .slice(-8)
            .reverse()
            .map((record) => {
              const employee = employees.find((emp) => emp.id === record.employeeId)
              return (
                <div
                  key={record.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="text-lg">{getActionIcon(record.action)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{employee?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatAction(record.action)} • {employee?.department}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {new Date(record.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              )
            })}
          {attendanceRecords.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

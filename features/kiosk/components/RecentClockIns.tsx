"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, TrendingUp } from "lucide-react"
import { useAttendanceStore } from "@/store/useAttendanceStore"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentClockIns() {
  const { attendanceRecords, employees } = useAttendanceStore()

  // Get today's clock-ins
  const todayClockIns = attendanceRecords
    .filter((record) => {
      const today = new Date()
      const recordDate = new Date(record.timestamp)
      return recordDate.toDateString() === today.toDateString() && record.action === "clock-in"
    })
    .slice(-5)
    .reverse()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          Recent Clock-Ins
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todayClockIns.map((record) => {
            const employee = employees.find((emp) => emp.id === record.employeeId)
            if (!employee) return null

            return (
              <div key={record.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{getInitials(employee.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">{employee.department}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(record.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            )
          })}

          {todayClockIns.length === 0 && (
            <div className="text-center py-6">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No clock-ins today</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

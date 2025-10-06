"use client"

import { useEmployeeStore } from "@/store/employee-store"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const { employee, attendanceRecords } = useEmployeeStore()

  if (!employee) return null

  // Get today's attendance status
  const today = new Date().toISOString().split("T")[0]
  const todayRecord = attendanceRecords.find((record) => record.date === today)
  const currentStatus = todayRecord?.status || "absent"

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-present text-white"
      case "absent":
        return "bg-absent text-white"
      case "late":
        return "bg-late text-white"
      case "leave":
        return "bg-leave text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "present":
        return "Present"
      case "absent":
        return "Absent"
      case "late":
        return "Late"
      case "leave":
        return "On Leave"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="bg-card rounded-lg border p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Welcome, {employee.firstName}!</h2>
          <p className="text-muted-foreground">{formatDate(new Date())}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Current Status:</span>
          <Badge className={cn("font-medium", getStatusColor(currentStatus))}>{getStatusText(currentStatus)}</Badge>
        </div>
      </div>
    </div>
  )
}

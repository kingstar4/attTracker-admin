"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ArrowRight } from "lucide-react"
import { useAttendanceStore } from "@/store/useAttendanceStore"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function EmployeeStatusList() {
  const { employees } = useAttendanceStore()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "break":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "out":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Employee Status
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-xs">
          Manage
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {employees.slice(0, 6).map((employee) => (
            <div
              key={employee.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{getInitials(employee.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{employee.name}</p>
                <p className="text-xs text-muted-foreground">{employee.department}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                  {employee.status}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone: "UTC"
                      }).format(new Date(employee.lastAction))}
                </div>
              </div>
            </div>
          ))}
          {employees.length > 6 && (
            <div className="text-center pt-2">
              <Button variant="ghost" size="sm" className="text-xs">
                View {employees.length - 6} more employees
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

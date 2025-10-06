"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock, Coffee, LogIn, LogOut } from "lucide-react"

interface Employee {
  id: string
  name: string
  department: string
  status: "in" | "out" | "break"
  lastAction: Date
  fingerprintEnrolled: boolean
}

interface ClockInOutPanelProps {
  employee: Employee
  onAction: (action: "clock-in" | "clock-out" | "break-start" | "break-end") => void
}

export function ClockInOutPanel({ employee, onAction }: ClockInOutPanelProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

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

  const getAvailableActions = () => {
    switch (employee.status) {
      case "out":
        return [{ action: "clock-in" as const, label: "Clock In", icon: LogIn, variant: "default" as const }]
      case "in":
        return [
          { action: "clock-out" as const, label: "Clock Out", icon: LogOut, variant: "destructive" as const },
          { action: "break-start" as const, label: "Start Break", icon: Coffee, variant: "outline" as const },
        ]
      case "break":
        return [
          { action: "break-end" as const, label: "End Break", icon: Clock, variant: "default" as const },
          { action: "clock-out" as const, label: "Clock Out", icon: LogOut, variant: "destructive" as const },
        ]
      default:
        return []
    }
  }

  const actions = getAvailableActions()

  return (
    <div className="text-center space-y-6 w-full max-w-md">
      <div className="space-y-4">
        <Avatar className="h-20 w-20 mx-auto">
          <AvatarFallback className="text-2xl">{getInitials(employee.name)}</AvatarFallback>
        </Avatar>

        <div>
          <h3 className="text-2xl font-bold">{employee.name}</h3>
          <p className="text-muted-foreground">{employee.department}</p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Badge className={getStatusColor(employee.status)}>Current Status: {employee.status.toUpperCase()}</Badge>
        </div>

        <div className="text-sm text-muted-foreground">
          Last action: {new Date(employee.lastAction).toLocaleString()}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-lg">What would you like to do?</h4>

        <div className="grid gap-3">
          {actions.map((actionItem) => (
            <Button
              key={actionItem.action}
              onClick={() => onAction(actionItem.action)}
              variant={actionItem.variant}
              size="lg"
              className="h-14 text-lg"
            >
              <actionItem.icon className="h-6 w-6 mr-3" />
              {actionItem.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

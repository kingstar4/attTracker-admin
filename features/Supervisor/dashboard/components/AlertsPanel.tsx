"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Info, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Alert {
  id: string
  type: "warning" | "info" | "success"
  title: string
  message: string
  dismissible: boolean
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "warning",
      title: "Fingerprint Enrollment Incomplete",
      message: "2 employees still need to complete fingerprint enrollment",
      dismissible: true,
    },
    {
      id: "2",
      type: "info",
      title: "System Maintenance",
      message: "Scheduled maintenance tonight at 11 PM - 1 AM",
      dismissible: true,
    },
  ])

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const getAlertBg = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
      case "success":
        return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
      default:
        return "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
    }
  }

  if (alerts.length === 0) return null

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card key={alert.id} className={`${getAlertBg(alert.type)} border`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{alert.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
              </div>
              {alert.dismissible && (
                <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)} className="h-6 w-6 p-0">
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

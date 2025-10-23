"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle } from "lucide-react"
import { useAttendanceStore } from "@/store/useAttendanceStore"
import { ClockInOutPanel } from "./components/ClockInOutPanel"
import { KioskHeader } from "./components/KioskHeader"
import { RecentClockIns } from "./components/RecentClockIns"
import { useToast } from "@/components/ui/use-toast"

interface LastActionState {
  employee: string
  action: string
  timestamp: string
}

export function AttendanceKiosk() {
  const [lastAction, setLastAction] = useState<LastActionState | null>(null)
  const [panelResetCounter, setPanelResetCounter] = useState(0)
  const { employees } = useAttendanceStore()
  const { toast } = useToast()

  const currentlyIn = employees.filter((emp) => emp.status === "in").length
  const onBreak = employees.filter((emp) => emp.status === "break").length

  const handleSubmissionSuccess = (payload: { employeeId: string; action: "clock-in" | "clock-out" }) => {
    const nowIso = new Date().toISOString()
    const matchedEmployee = employees.find((emp) => emp.id === payload.employeeId)
    setLastAction({
      employee: matchedEmployee ? matchedEmployee.name : `Employee ID ${payload.employeeId}`,
      action: payload.action.replace("-", " "),
      timestamp: nowIso,
    })

    toast({
      title: payload.action === "clock-in" ? "Clock-In Recorded" : "Clock-Out Recorded",
      description: `${matchedEmployee ? matchedEmployee.name : `Employee ${payload.employeeId}`} has been ${payload.action.replace("-", "ed ")} successfully.`,
    })
  }

  const resetKiosk = () => {
    setLastAction(null)
    setPanelResetCounter((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6 dark:from-gray-900 dark:to-gray-800 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <KioskHeader onReset={resetKiosk} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="h-full min-h-[460px] sm:min-h-[520px]">
              <CardHeader className="pb-4 text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold sm:text-3xl">
                  <Clock className="h-6 w-6 sm:h-7 sm:w-7" />
                  Attendance Kiosk
                </CardTitle>
                <p className="text-sm text-muted-foreground sm:text-base">
                  Enter the employee ID, OTP code, and device IP to record attendance.
                </p>
              </CardHeader>

              <CardContent className="flex flex-col gap-6 lg:items-center">
                <ClockInOutPanel
                  key={panelResetCounter}
                  onSuccess={({ employeeId, action }) => handleSubmissionSuccess({ employeeId, action })}
                />

                {lastAction && (
                  <div className="w-full max-w-xl rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">
                        {lastAction.employee} - {lastAction.action} recorded at{" "}
                        {new Date(lastAction.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <RecentClockIns />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">Currently In</span>
                  <Badge variant="secondary">{currentlyIn}</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">On Break</span>
                  <Badge variant="outline">{onBreak}</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">Total Employees</span>
                  <Badge>{employees.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

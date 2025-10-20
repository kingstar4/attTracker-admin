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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <KioskHeader onReset={resetKiosk} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="min-h-[520px]">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                  <Clock className="h-6 w-6" />
                  Attendance Kiosk
                </CardTitle>
                <p className="text-muted-foreground">
                  Enter the employee ID, OTP code, and device IP to record attendance.
                </p>
              </CardHeader>

              <CardContent className="flex flex-col items-center gap-6">
                <ClockInOutPanel
                  key={panelResetCounter}
                  onSuccess={({ employeeId, action }) => handleSubmissionSuccess({ employeeId, action })}
                />

                {lastAction && (
                  <div className="w-full max-w-xl p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">
                        {lastAction.employee} - {lastAction.action} recorded at{" "}
                        {new Date(lastAction.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <RecentClockIns />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Currently In</span>
                  <Badge variant="secondary">{currentlyIn}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">On Break</span>
                  <Badge variant="outline">{onBreak}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Employees</span>
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

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Clock, User, CheckCircle, XCircle, Search } from "lucide-react"
import { useAttendanceStore } from "@/store/useAttendanceStore"
import { FingerprintScanner } from "./components/FingerprintScanner"
import { EmployeeSelector } from "./components/EmployeeSelector"
import { ClockInOutPanel } from "./components/ClockInOutPanel"
import { KioskHeader } from "./components/KioskHeader"
import { RecentClockIns } from "./components/RecentClockIns"

type KioskMode = "fingerprint" | "manual" | "success" | "error"

export function AttendanceKiosk() {
  const [mode, setMode] = useState<KioskMode>("fingerprint")
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [lastAction, setLastAction] = useState<{
    employee: string
    action: string
    timestamp: Date
  } | null>(null)

  const { employees, recordAttendance, getEmployeeStatus } = useAttendanceStore()

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleFingerprintScan = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    if (employee && employee.fingerprintEnrolled) {
      setSelectedEmployee(employeeId)
      setMode("success")
    } else {
      setMode("error")
    }
  }

  const handleManualSelection = (employeeId: string) => {
    setSelectedEmployee(employeeId)
  }

  const handleClockAction = (action: "clock-in" | "clock-out" | "break-start" | "break-end") => {
    if (!selectedEmployee) return

    const employee = employees.find((emp) => emp.id === selectedEmployee)
    if (!employee) return

    recordAttendance({
      employeeId: selectedEmployee,
      action,
      timestamp: new Date(),
    })

    setLastAction({
      employee: employee.name,
      action: action.replace("-", " "),
      timestamp: new Date(),
    })

    // Reset after 3 seconds
    setTimeout(() => {
      setSelectedEmployee(null)
      setMode("fingerprint")
      setSearchTerm("")
    }, 3000)
  }

  const resetKiosk = () => {
    setSelectedEmployee(null)
    setMode("fingerprint")
    setSearchTerm("")
    setLastAction(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <KioskHeader onReset={resetKiosk} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Kiosk Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                  <Clock className="h-6 w-6" />
                  Attendance Kiosk
                </CardTitle>
                <p className="text-muted-foreground">
                  {mode === "fingerprint" && "Scan your fingerprint or search manually"}
                  {mode === "manual" && "Select your name from the list"}
                  {mode === "success" && "Employee verified successfully"}
                  {mode === "error" && "Fingerprint not recognized"}
                </p>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {mode === "fingerprint" && (
                  <div className="space-y-6">
                    <FingerprintScanner onScan={handleFingerprintScan} />

                    <div className="text-center">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-muted" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name or department..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 text-lg h-12"
                        />
                      </div>

                      {searchTerm && (
                        <Button onClick={() => setMode("manual")} className="w-full h-12 text-lg" variant="outline">
                          <User className="h-5 w-5 mr-2" />
                          Manual Selection
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {mode === "manual" && (
                  <EmployeeSelector
                    employees={filteredEmployees}
                    searchTerm={searchTerm}
                    onSelect={handleManualSelection}
                    onBack={() => setMode("fingerprint")}
                  />
                )}

                {(mode === "success" || mode === "error") && selectedEmployee && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                    {mode === "success" ? (
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    ) : (
                      <XCircle className="h-16 w-16 text-red-500" />
                    )}

                    {mode === "success" && (
                      <ClockInOutPanel
                        employee={employees.find((emp) => emp.id === selectedEmployee)!}
                        onAction={handleClockAction}
                      />
                    )}

                    {mode === "error" && (
                      <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold text-red-600">Fingerprint Not Recognized</h3>
                        <p className="text-muted-foreground">Please try again or use manual selection</p>
                        <Button onClick={() => setMode("fingerprint")} variant="outline">
                          Try Again
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {lastAction && (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">
                        {lastAction.employee} - {lastAction.action} recorded at{" "}
                        {lastAction.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <RecentClockIns />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Currently In</span>
                  <Badge variant="secondary">{employees.filter((emp) => emp.status === "in").length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">On Break</span>
                  <Badge variant="outline">{employees.filter((emp) => emp.status === "break").length}</Badge>
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

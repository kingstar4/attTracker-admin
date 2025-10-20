"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogIn, LogOut, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import api from "@/lib/api"
import { useAttendanceStore } from "@/store/useAttendanceStore"

interface AttendanceFormState {
  employeeId: string
  otpCode: string
  deviceIp: string
}

interface ClockInOutPanelProps {
  onSuccess?: (payload: {
    employeeId: string
    action: "clock-in" | "clock-out"
    deviceIp: string
    otpCode: string
  }) => void
}

const defaultFormState: AttendanceFormState = {
  employeeId: "",
  otpCode: "",
  deviceIp: "",
}

const isSameDay = (timestamp: string, reference: Date) => {
  const recordDate = new Date(timestamp)
  return (
    recordDate.getFullYear() === reference.getFullYear() &&
    recordDate.getMonth() === reference.getMonth() &&
    recordDate.getDate() === reference.getDate()
  )
}

export function ClockInOutPanel({ onSuccess }: ClockInOutPanelProps) {
  const { toast } = useToast()
  const attendanceRecords = useAttendanceStore((state) => state.attendanceRecords)
  const employees = useAttendanceStore((state) => state.employees)
  const [processing, setProcessing] = useState(false)
  const [selectedAction, setSelectedAction] = useState<"clock-in" | "clock-out">("clock-in")
  const [formState, setFormState] = useState<AttendanceFormState>(defaultFormState)

  const trimmedEmployeeId = formState.employeeId.trim()

  const hasClockedInToday = useMemo(() => {
    if (!trimmedEmployeeId) return false
    const today = new Date()
    return attendanceRecords.some(
      (record) =>
        record.employeeId === trimmedEmployeeId &&
        record.action === "clock-in" &&
        isSameDay(record.timestamp, today),
    )
  }, [attendanceRecords, trimmedEmployeeId])

  const currentEmployee = useMemo(
    () => employees.find((emp) => emp.id === trimmedEmployeeId),
    [employees, trimmedEmployeeId],
  )

  const clockInBlocked = selectedAction === "clock-in" && (hasClockedInToday || currentEmployee?.status === "in")

  const canSubmit = useMemo(() => {
    if (clockInBlocked) return false
    return (
      trimmedEmployeeId.length > 0 &&
      formState.otpCode.trim().length > 0 &&
      formState.deviceIp.trim().length > 0 &&
      !processing
    )
  }, [clockInBlocked, trimmedEmployeeId, formState.otpCode, formState.deviceIp, processing])

  const handleSubmit = async () => {
    if (!canSubmit) {
      if (clockInBlocked) {
        toast({
          title: "Clock-In Not Allowed",
          description: "This employee has already clocked in today.",
          variant: "destructive",
        })
      }
      return
    }

    try {
      setProcessing(true)

      const trimmedOtp = formState.otpCode.trim()
      const trimmedDeviceIp = formState.deviceIp.trim()

      const endpoint =
        selectedAction === "clock-in"
          ? "/supervisor/attendance/clock-in"
          : "/supervisor/attendance/clock-out"

      await api.post(endpoint, {
        employee_id: trimmedEmployeeId,
        method: "otp",
        device_ip: trimmedDeviceIp,
        otp_code: trimmedOtp,
        device_id: window.navigator.userAgent,
      })

      toast({
        title: selectedAction === "clock-in" ? "Clock-In Successful" : "Clock-Out Successful",
        description: `Employee ${trimmedEmployeeId} has been ${selectedAction === "clock-in" ? "clocked in" : "clocked out"} for today.`,
      })

      onSuccess?.({
        employeeId: trimmedEmployeeId,
        action: selectedAction,
        deviceIp: trimmedDeviceIp,
        otpCode: trimmedOtp,
      })

      setFormState((prev) => ({
        ...prev,
        employeeId: "",
        otpCode: "",
      }))
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description:
          error?.response?.data?.message ??
          error?.message ??
          "Unable to submit attendance. Please verify the details and try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="w-full max-w-xl space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Employee ID</label>
        <Input
          placeholder="Enter employee ID"
          value={formState.employeeId}
          onChange={(event) => setFormState((prev) => ({ ...prev, employeeId: event.target.value }))}
          disabled={processing}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">OTP Code</label>
        <Input
          placeholder="Enter OTP code"
          value={formState.otpCode}
          onChange={(event) => setFormState((prev) => ({ ...prev, otpCode: event.target.value }))}
          disabled={processing}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Device IP</label>
        <Input
          placeholder="Enter device IP address"
          value={formState.deviceIp}
          onChange={(event) => setFormState((prev) => ({ ...prev, deviceIp: event.target.value }))}
          disabled={processing}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Attendance Action</label>
        <Select
          value={selectedAction}
          onValueChange={(value) => setSelectedAction(value as "clock-in" | "clock-out")}
          disabled={processing}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose an action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clock-in">
              <span className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Clock In
              </span>
            </SelectItem>
            <SelectItem value="clock-out">
              <span className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Clock Out
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
        {clockInBlocked && (
          <p className="text-xs text-destructive">
            Employee has already clocked in today. Please select Clock Out instead.
          </p>
        )}
      </div>

      <Button
        type="button"
        size="lg"
        className="w-full h-14 text-lg gap-2"
        onClick={handleSubmit}
        disabled={!canSubmit}
      >
        {processing ? (
          <>
            <RefreshCw className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : selectedAction === "clock-in" ? (
          <>
            <LogIn className="h-5 w-5" />
            Clock In
          </>
        ) : (
          <>
            <LogOut className="h-5 w-5" />
            Clock Out
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Ensure the employee provides the OTP emailed to them and the IP address of the device used to request
        the OTP before recording attendance.
      </p>
    </div>
  )
}

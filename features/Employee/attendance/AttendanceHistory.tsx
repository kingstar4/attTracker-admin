"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useEmployeeModuleStore } from "@/store/useEmployeeModuleStore"
import { format } from "date-fns"

const formatDisplayDate = (date: string) => {
  if (!date) return "-"
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return format(parsed, "eee, MMM d yyyy")
}

const statusColor = (status: string) => {
  switch (status) {
    case "present":
      return "bg-present text-white"
    case "late":
      return "bg-late text-white"
    case "leave":
      return "bg-leave text-white"
    case "absent":
    default:
      return "bg-absent text-white"
  }
}

export function AttendanceHistory() {
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  const {
    attendanceHistory,
    attendanceHistoryLoading,
    attendanceHistoryError,
    attendanceHistoryFilters,
    fetchAttendanceHistory,
  } = useEmployeeModuleStore()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!startDate || !endDate) return
    await fetchAttendanceHistory(startDate, endDate)
  }

  const hasSearched = Boolean(attendanceHistoryFilters)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3 md:items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground" htmlFor="history-start-date">
                Start Date
              </label>
              <Input
                id="history-start-date"
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => setStartDate(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground" htmlFor="history-end-date">
                End Date
              </label>
              <Input
                id="history-end-date"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => setEndDate(event.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!startDate || !endDate || attendanceHistoryLoading}
            >
              {attendanceHistoryLoading ? "Loading..." : "View History"}
            </Button>
          </form>
          {attendanceHistoryFilters && (
            <p className="text-xs text-muted-foreground mt-3">
              Showing records between{" "}
              <span className="font-medium">
                {formatDisplayDate(attendanceHistoryFilters.startDate ?? "")}
              </span>{" "}
              and{" "}
              <span className="font-medium">
                {formatDisplayDate(attendanceHistoryFilters.endDate ?? "")}
              </span>
              .
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceHistoryError ? (
            <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
              {attendanceHistoryError}
            </div>
          ) : attendanceHistoryLoading ? (
            <div className="h-32 w-full animate-pulse rounded-md bg-muted" />
          ) : attendanceHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {hasSearched
                ? "No attendance records found for the selected period."
                : "Select a date range to view your attendance history."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 px-3 font-medium">Date</th>
                    <th className="py-2 px-3 font-medium">Clock In</th>
                    <th className="py-2 px-3 font-medium">Clock Out</th>
                    <th className="py-2 px-3 font-medium">Status</th>
                    <th className="py-2 px-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((record) => (
                    <tr key={record.id} className="border-b">
                      <td className="py-3 px-3 whitespace-nowrap">
                        {formatDisplayDate(record.date)}
                      </td>
                      <td className="py-3 px-3">{record.clockIn || "-"}</td>
                      <td className="py-3 px-3">{record.clockOut || "-"}</td>
                      <td className="py-3 px-3">
                        <Badge className={cn("capitalize", statusColor(record.status))}>
                          {record.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {record.notes || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

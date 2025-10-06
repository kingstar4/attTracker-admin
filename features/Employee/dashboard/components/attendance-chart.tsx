"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEmployeeStore } from "@/store/employee-store"

export function AttendanceChart() {
  const { attendanceRecords } = useEmployeeStore()

  // Generate chart data for the last 30 days
  const generateChartData = () => {
    const data = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const record = attendanceRecords.find((r) => r.date === dateString)
      let statusScore = 0

      if (record) {
        switch (record.status) {
          case "present":
            statusScore = 100
            break
          case "late":
            statusScore = 75
            break
          case "leave":
            statusScore = 50
            break
          case "absent":
            statusScore = 0
            break
        }
      }

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        statusScore,
        fullDate: dateString,
      })
    }

    return data
  }

  const chartData = generateChartData()

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Attendance Trend</CardTitle>
        <CardDescription>Your attendance pattern over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip
              formatter={(value: number) => {
                if (value === 100) return ["Present", "Status"]
                if (value === 75) return ["Late", "Status"]
                if (value === 50) return ["On Leave", "Status"]
                if (value === 0) return ["Absent", "Status"]
                return ["Unknown", "Status"]
              }}
            />
            <Line
              type="monotone"
              dataKey="statusScore"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useAttendanceStore } from "@/store/useAttendanceStore"

export function AttendanceChart() {
  const { attendanceRecords } = useAttendanceStore()

  // Generate mock data for the past 7 days
  const generateChartData = () => {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      // Mock attendance data - in a real app this would come from actual records
      const clockIns = Math.floor(Math.random() * 20) + 15
      const clockOuts = Math.floor(Math.random() * 18) + 12

      data.push({
        date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        clockIns,
        clockOuts,
        present: clockIns,
      })
    }
    return data
  }

  const chartData = generateChartData()

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="clockIns"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            name="Clock Ins"
            dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="clockOuts"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            name="Clock Outs"
            dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

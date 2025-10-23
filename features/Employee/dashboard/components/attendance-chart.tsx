"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEmployeeModuleStore } from "@/store/useEmployeeModuleStore";

export function AttendanceChart() {
  const { attendanceRecords, dashboardLoading } = useEmployeeModuleStore();

  // Generate chart data for the last 30 days
  const generateChartData = () => {
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      const record = attendanceRecords.find((r) => r.date === dateString);
      let statusScore = 0;

      if (record) {
        switch (record.status) {
          case "present":
            statusScore = 100;
            break;
          case "late":
            statusScore = 75;
            break;
          case "leave":
            statusScore = 50;
            break;
          case "absent":
            statusScore = 0;
            break;
        }
      }

      data.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        statusScore,
        fullDate: dateString,
      });
    }

    return data;
  };

  const chartData = generateChartData();

  return (
    <Card className="col-span-full md:col-span-2 lg:col-span-2">
      <CardHeader>
        <CardTitle>Attendance Trend</CardTitle>
        <CardDescription>
          Your attendance pattern over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {dashboardLoading && attendanceRecords.length === 0 ? (
          <div className="h-[300px] w-full animate-pulse bg-muted rounded-lg" />
        ) : attendanceRecords.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-12">
            No attendance records available yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--muted-foreground))"
                opacity={0.2}
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--foreground))"
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                }}
                tick={{
                  fill: "currentColor",
                  className: "text-foreground",
                }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="hsl(var(--foreground))"
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                }}
                tick={{
                  fill: "currentColor",
                  className: "text-foreground",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number) => {
                  if (value === 100) return ["Present", "Status"];
                  if (value === 75) return ["Late", "Status"];
                  if (value === 50) return ["On Leave", "Status"];
                  if (value === 0) return ["Absent", "Status"];
                  return ["Unknown", "Status"];
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Line
                type="monotone"
                dataKey="statusScore"
                stroke="#22c55e"
                strokeWidth={2}
                dot={(props) => {
                  const value = props.payload.statusScore;
                  let color;
                  switch (value) {
                    case 100:
                      color = "#22c55e"; // green for present
                      break;
                    case 75:
                      color = "#eab308"; // yellow for late
                      break;
                    case 50:
                      color = "#3b82f6"; // blue for leave
                      break;
                    case 0:
                      color = "#ef4444"; // red for absent
                      break;
                    default:
                      color = "#94a3b8"; // gray for unknown
                  }
                  return (
                    <circle
                      key={
                        props.payload?.fullDate ??
                        `dot-${props.cx}-${props.cy ?? 0}`
                      }
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill={color}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

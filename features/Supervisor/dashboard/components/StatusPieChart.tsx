"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupervisorStore } from "@/store/useSupervisorStore";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// Define colors for each status
const STATUS_COLORS = {
  present: "#22c55e", // Green
  absent: "#ef4444", // Red
  on_break: "#f59e0b", // Orange/Amber
  on_leave: "#6366f1", // Indigo
};

export function StatusPieChart() {
  const { todayAttendance, fetchTodayAttendance } = useSupervisorStore();

  useEffect(() => {
    fetchTodayAttendance();
  }, [fetchTodayAttendance]);

  if (!todayAttendance?.employees) return null;

  const presentCount = todayAttendance.employees.filter(
    (e) => e.status === "present"
  ).length;
  const absentCount = todayAttendance.employees.filter(
    (e) => e.status === "absent"
  ).length;
  const onBreakCount = todayAttendance.employees.filter(
    (e) => e.status === "on_break"
  ).length;
  const onLeaveCount = todayAttendance.employees.filter(
    (e) => e.status === "on_leave"
  ).length;

  const data = [
    { name: "Present", value: presentCount, color: STATUS_COLORS.present },
    { name: "Absent", value: absentCount, color: STATUS_COLORS.absent },
    { name: "On Break", value: onBreakCount, color: STATUS_COLORS.on_break },
    { name: "On Leave", value: onLeaveCount, color: STATUS_COLORS.on_leave },
  ].filter((d) => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any) => [
                  `${value} employees`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

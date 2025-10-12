"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAttendanceStore } from "@/store/useAttendanceStore";
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
  in: "#22c55e", // Green
  out: "#ef4444", // Red
  break: "#f59e0b", // Orange/Amber
};

export function StatusPieChart() {
  const { employees } = useAttendanceStore();

  const inCount = employees.filter((e) => e.status === "in").length;
  const outCount = employees.filter((e) => e.status === "out").length;
  const breakCount = employees.filter((e) => e.status === "break").length;

  const data = [
    { name: "In", value: inCount, color: STATUS_COLORS.in },
    { name: "Out", value: outCount, color: STATUS_COLORS.out },
    { name: "Break", value: breakCount, color: STATUS_COLORS.break },
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

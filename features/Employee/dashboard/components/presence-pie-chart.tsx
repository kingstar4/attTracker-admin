"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieLabelRenderProps,
} from "recharts";
import { useEmployeeModuleStore } from "@/store/useEmployeeModuleStore";

export function PresencePieChart() {
  const { attendanceRecords } = useEmployeeModuleStore();

  // Calculate presence data
  const presentCount = attendanceRecords.filter(
    (record) => record.status === "present"
  ).length;
  const absentCount = attendanceRecords.filter(
    (record) => record.status === "absent"
  ).length;
  const lateCount = attendanceRecords.filter(
    (record) => record.status === "late"
  ).length;
  const leaveCount = attendanceRecords.filter(
    (record) => record.status === "leave"
  ).length;

  const data = [
    { name: "Present", value: presentCount, color: "hsl(var(--present))" },
    { name: "Absent", value: absentCount, color: "hsl(var(--absent))" },
    { name: "Late", value: lateCount, color: "hsl(var(--late))" },
    { name: "Leave", value: leaveCount, color: "hsl(var(--leave))" },
  ].filter((item) => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Summary</CardTitle>
        <CardDescription>
          Distribution of your attendance status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props: PieLabelRenderProps) => {
                const percent = props.percent ? Number(props.percent) : 0;
                return `${props.name} ${(percent * 100).toFixed(0)}%`;
              }}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

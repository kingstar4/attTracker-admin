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
  const { attendanceSummary, dashboardLoading } = useEmployeeModuleStore();

  const presentCount = attendanceSummary?.daysPresentThisMonth ?? 0;
  const totalWorkingDays = attendanceSummary?.totalWorkingDays ?? 0;
  const absentCount = Math.max(totalWorkingDays - presentCount, 0);

  const data = [
    { name: "Present", value: presentCount, color: "#22c55e" }, // Green color
    { name: "Absent", value: absentCount, color: "#ef4444" }, // Red color
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
        {dashboardLoading && !attendanceSummary ? (
          <div className="h-[300px] w-full animate-pulse bg-muted rounded-lg" />
        ) : data.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-12">
            No attendance summary available yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: PieLabelRenderProps) => {
                  const percent = props.percent ? Number(props.percent) : 0;
                  if (percent < 0.05) return null; // Don't show label if segment is too small
                  return (
                    <text
                      x={props.x}
                      y={props.y}
                      className="dark:text-white text-black"
                      fill="currentColor"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        filter: "drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.3))",
                      }}
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number, name: string) => [
                  `${value} days`,
                  name,
                ]}
              />
              <Legend
                formatter={(value, entry) => (
                  <span
                    style={{ color: "var(--foreground)", marginLeft: "4px" }}
                  >
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEmployeeModuleStore } from "@/store/useEmployeeModuleStore";
import { cn } from "@/lib/utils";

export function RecentActivity() {
  const { attendanceRecords, dashboardLoading } = useEmployeeModuleStore();

  // Get recent records (last 10)
  const recentRecords = attendanceRecords
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "absent":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "late":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "leave":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString || "-";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest attendance records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dashboardLoading && attendanceRecords.length === 0 ? (
            <div className="h-40 w-full animate-pulse rounded-lg bg-muted" />
          ) : recentRecords.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">
              No attendance records found
            </p>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left font-medium">Date</th>
                      <th className="px-4 py-2 text-left font-medium">
                        Clock In
                      </th>
                      <th className="px-4 py-2 text-left font-medium">
                        Clock Out
                      </th>
                      <th className="px-4 py-2 text-left font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRecords.map((record) => (
                      <tr key={record.id} className="border-b">
                        <td className="px-4 py-3">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-4 py-3">{record.clockIn || "-"}</td>
                        <td className="px-4 py-3">{record.clockOut || "-"}</td>
                        <td className="px-4 py-3">
                          <Badge
                            className={cn(
                              "capitalize",
                              getStatusColor(record.status)
                            )}
                          >
                            {record.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 md:hidden">
                {recentRecords.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-lg border border-border/70 bg-background p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold">
                        {formatDate(record.date)}
                      </p>
                      <Badge
                        className={cn(
                          "capitalize",
                          getStatusColor(record.status)
                        )}
                      >
                        {record.status}
                      </Badge>
                    </div>
                    <dl className="mt-3 space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between gap-2">
                        <dt className="font-medium text-foreground">
                          Clock In
                        </dt>
                        <dd>{record.clockIn || "-"}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="font-medium text-foreground">
                          Clock Out
                        </dt>
                        <dd>{record.clockOut || "-"}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

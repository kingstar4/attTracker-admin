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
  const { attendanceRecords } = useEmployeeModuleStore();

  // Get recent records (last 10)
  const recentRecords = attendanceRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-present text-white";
      case "absent":
        return "bg-absent text-white";
      case "late":
        return "bg-late text-white";
      case "leave":
        return "bg-leave text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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
          {recentRecords.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No attendance records found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-medium">Date</th>
                    <th className="text-left py-2 px-4 font-medium">
                      Clock In
                    </th>
                    <th className="text-left py-2 px-4 font-medium">
                      Clock Out
                    </th>
                    <th className="text-left py-2 px-4 font-medium">Status</th>
                    <th className="text-left py-2 px-4 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecords.map((record) => (
                    <tr key={record.id} className="border-b">
                      <td className="py-3 px-4">{formatDate(record.date)}</td>
                      <td className="py-3 px-4">{record.clockIn || "-"}</td>
                      <td className="py-3 px-4">{record.clockOut || "-"}</td>
                      <td className="py-3 px-4">
                        <Badge
                          className={cn(
                            "capitalize",
                            getStatusColor(record.status)
                          )}
                        >
                          {record.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {record.notes || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

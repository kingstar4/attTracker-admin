"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSupervisorStore } from "@/store/useSupervisorStore";
import { Users, Fingerprint, KeyRound } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useEmployeeStore } from "@/store/useEmployeeStore";

export function TodayAttendance() {
  const { todayAttendance, fetchTodayAttendance } = useSupervisorStore();
  const { employees } = useEmployeeStore();
  const verifiedEmployeeEmails = useMemo(
    () => employees.filter((emp) => emp.email_verified).map((emp) => emp.email),
    [employees]
  );

  const verifiedEmployees = employees.filter(
    (emp) => emp.email_verified
  ).length;

  useEffect(() => {
    fetchTodayAttendance();
    // Refresh every 5 minutes
    const interval = setInterval(fetchTodayAttendance, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchTodayAttendance]);

  const stats = useMemo(() => {
    if (!todayAttendance) return null;

    if (verifiedEmployees === 0) return null;

    const verifiedAttendance = todayAttendance.employees.filter((emp) =>
      verifiedEmployeeEmails.includes(emp.email)
    );

    const present = verifiedAttendance.filter(
      (e) => e.status === "present"
    ).length;
    const absent = verifiedAttendance.filter(
      (e) => e.status === "absent"
    ).length;
    const onBreak = verifiedAttendance.filter(
      (e) => e.status === "on_break"
    ).length;
    const total = verifiedAttendance.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { present, absent, onBreak, total, percentage };
  }, [todayAttendance]);

  if (!todayAttendance || !stats) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "absent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "on_break":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Today's Attendance
          </div>
          <span className="text-sm font-normal text-muted-foreground">
            {format(new Date(todayAttendance.date), "MMMM d, yyyy")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-3 bg-secondary/20 rounded-lg">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-2xl font-bold">{stats.total}</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <span className="text-sm text-green-600 dark:text-green-400">
              Present
            </span>
            <span className="text-2xl font-bold text-green-700 dark:text-green-300">
              {stats.present}
            </span>
          </div>
          <div className="flex flex-col items-center p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <span className="text-sm text-red-600 dark:text-red-400">
              Absent
            </span>
            <span className="text-2xl font-bold text-red-700 dark:text-red-300">
              {stats.absent}
            </span>
          </div>
          <div className="flex flex-col items-center p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              On Break
            </span>
            <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {stats.onBreak}
            </span>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayAttendance.employees
                .filter((emp) => verifiedEmployeeEmails.includes(emp.email))
                .map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{employee.clock_in_time || "-"}</TableCell>
                    <TableCell>{employee.clock_out_time || "-"}</TableCell>
                    <TableCell>
                      {employee.method ? (
                        <div className="flex items-center gap-1">
                          {employee.method === "fingerprint" ? (
                            <Fingerprint className="h-4 w-4" />
                          ) : (
                            <KeyRound className="h-4 w-4" />
                          )}
                          <span className="capitalize">{employee.method}</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

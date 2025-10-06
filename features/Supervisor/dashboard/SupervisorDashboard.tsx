"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Clock,
  UserCheck,
  TrendingUp,
  Calendar,
  MapPin,
} from "lucide-react";
import { useAttendanceStore } from "@/store/useAttendanceStore";
import { AttendanceChart } from "./components/AttendanceChart";
import { DepartmentChart } from "./components/DepartmentChart";
import { RecentActivity } from "./components/RecentActivity";
import { EmployeeStatusList } from "./components/EmployeeStatusList";
import { QuickActions } from "./components/QuickActions";
import { AlertsPanel } from "./components/AlertsPanel";

export function SupervisorDashboard() {
  const { employees, attendanceRecords } = useAttendanceStore();

  const employeesIn = employees.filter((emp) => emp.status === "in").length;
  const employeesOut = employees.filter((emp) => emp.status === "out").length;
  const employeesOnBreak = employees.filter(
    (emp) => emp.status === "break"
  ).length;
  const todayRecords = attendanceRecords.filter((record) => {
    const today = new Date();
    const recordDate = new Date(record.timestamp);
    return recordDate.toDateString() === today.toDateString();
  }).length;

  const stats = [
    {
      title: "Total Employees",
      value: employees.length,
      icon: Users,
      color: "text-blue-600",
      change: "+2 this week",
      changeType: "positive" as const,
    },
    {
      title: "Currently In",
      value: employeesIn,
      icon: UserCheck,
      color: "text-green-600",
      change: `${Math.round((employeesIn / employees.length) * 100)}% attendance`,
      changeType: "neutral" as const,
    },
    {
      title: "On Break",
      value: employeesOnBreak,
      icon: Clock,
      color: "text-yellow-600",
      change: "Average 15 min",
      changeType: "neutral" as const,
    },
    {
      title: "Today's Records",
      value: todayRecords,
      icon: TrendingUp,
      color: "text-purple-600",
      change: "+12% vs yesterday",
      changeType: "positive" as const,
    },
  ];

  const totalHoursToday =
    attendanceRecords
      .filter((record) => {
        const today = new Date();
        const recordDate = new Date(record.timestamp);
        return recordDate.toDateString() === today.toDateString();
      })
      .reduce((acc, record) => {
        if (record.action === "clock-in" || record.action === "clock-out") {
          return acc + 1;
        }
        return acc;
      }, 0) * 8; // Approximate hours

  const enrollmentRate = Math.round(
    (employees.filter((emp) => emp.fingerprintEnrolled).length /
      employees.length) *
      100
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : stat.changeType === "neutral"
                      ? "text-red-600"
                      : "text-muted-foreground"
                }`}
              >
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertsPanel />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Attendance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceChart />
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Department Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DepartmentChart employees={employees} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Recent Activity */}
          <RecentActivity />

          {/* Employee Status */}
          <EmployeeStatusList />

          <Card>
            <CardHeader>
              <CardTitle>Quick Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Fingerprint Enrollment
                </span>
                <span className="font-medium">{enrollmentRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Estimated Hours Today
                </span>
                <span className="font-medium">{totalHoursToday}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Active Locations
                </span>
                <span className="font-medium flex items-center gap-1">
                  <MapPin className="h-3 w-3" />3 Sites
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

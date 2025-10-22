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
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { AttendanceChart } from "./components/AttendanceChart";
import { DepartmentChart } from "./components/DepartmentChart";
import { StatusPieChart } from "./components/StatusPieChart";
import { RecentActivity } from "./components/RecentActivity";
import { EmployeeStatusList } from "./components/EmployeeStatusList";
import { QuickActions } from "./components/QuickActions";
import { AlertsPanel } from "./components/AlertsPanel";
import { TodayAttendance } from "./components/TodayAttendance";

export function SupervisorDashboard() {
  const { employees, fetchEmployees } = useEmployeeStore();
  const { attendanceRecords } = useAttendanceStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const activeEmployees = employees.filter((emp) => emp.is_active).length;
  const inactiveEmployees = employees.filter((emp) => !emp.is_active).length;
  const verifiedEmployees = employees.filter(
    (emp) => emp.email_verified
  ).length;
  const employeesOnLeave = 0; // This will need to be updated when the leave system is implemented
  const todayRecords = attendanceRecords.filter((record) => {
    const today = new Date();
    const recordDate = new Date(record.timestamp);
    return recordDate.toDateString() === today.toDateString();
  }).length;

  const stats = [
    {
      title: "Total Employees",
      value: verifiedEmployees,
      icon: Users,
      color: "text-blue-600",
      change: "+2 this week",
      changeType: "positive" as const,
    },
    {
      title: "Active Employees",
      value: activeEmployees,
      icon: UserCheck,
      color: "text-green-600",
      change: `${Math.round((activeEmployees / employees.length) * 100)}% of total`,
      changeType: "positive" as const,
    },
    {
      title: "Inactive Employees",
      value: inactiveEmployees,
      icon: Users,
      color: "text-red-600",
      change: `${Math.round((inactiveEmployees / employees.length) * 100)}% of total`,
      changeType: "negative" as const,
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

  // We'll need to update this once fingerprint enrollment status is added to the API
  const enrollmentRate = 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {user?.firstName || "Supervisor"}
          </h1>
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
                    : stat.changeType === "negative"
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
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Department Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DepartmentChart employees={employees} />
            </CardContent>
          </Card> */}

          {/* Today's Attendance */}
          <TodayAttendance />
        </div>

        <div className="space-y-6">
          {/* Recent Activity */}
          <RecentActivity />

          {/* Employee Status */}
          <EmployeeStatusList />

          {/* Status Pie */}
          <StatusPieChart />

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

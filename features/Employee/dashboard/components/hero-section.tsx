"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  useEmployeeModuleStore,
  type AttendanceStatus,
} from "@/store/useEmployeeModuleStore";

const normalizeStatus = (status: string): AttendanceStatus => {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case "present":
    case "on_time":
    case "clocked_in":
      return "present";
    case "late":
    case "late_arrival":
      return "late";
    case "leave":
    case "on_leave":
      return "leave";
    default:
      return "absent";
  }
};

const toDateAtStartOfDay = (value: string) => {
  if (!value) return null;
  const candidate = value.includes("T")
    ? new Date(value)
    : new Date(`${value}T00:00:00`);
  if (Number.isNaN(candidate.getTime())) {
    return null;
  }
  candidate.setHours(0, 0, 0, 0);
  return candidate;
};

const isDateWithinRange = (target: string, start: string, end?: string) => {
  const targetDate = toDateAtStartOfDay(target);
  const startDate = toDateAtStartOfDay(start);
  const endDate = toDateAtStartOfDay(end ?? start);

  if (!targetDate || !startDate || !endDate) {
    return false;
  }

  return targetDate >= startDate && targetDate <= endDate;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const getStatusColor = (status: AttendanceStatus | "unknown") => {
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

const getStatusText = (status: AttendanceStatus | "unknown") => {
  switch (status) {
    case "present":
      return "Present";
    case "absent":
      return "Absent";
    case "late":
      return "Late";
    case "leave":
      return "Leave";
    default:
      return "No record for today";
  }
};

export function HeroSection() {
  const {
    employee,
    attendanceRecords,
    leaveRequests,
    dashboardLoading,
    profileLoading,
    dashboardError,
    profileError,
  } = useEmployeeModuleStore();

  if (dashboardError || profileError) {
    return (
      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold text-destructive">
          Unable to load dashboard
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          {dashboardError || profileError}
        </p>
      </div>
    );
  }

  if (profileLoading && dashboardLoading) {
    return (
      <div className="bg-card rounded-lg border p-6 mb-6 animate-pulse">
        <div className="h-6 w-40 bg-muted rounded mb-3" />
        <div className="h-4 w-60 bg-muted rounded" />
      </div>
    );
  }

  if (!employee) {
    return null;
  }

  const today = new Date();
  const todayIso = today.toISOString().split("T")[0];
  const todayRecord = attendanceRecords.find(
    (record) => record.date === todayIso
  );

  const isOnLeaveToday = leaveRequests.some(
    (request) =>
      request.status === "approved" &&
      isDateWithinRange(todayIso, request.start_date, request.end_date)
  );

  let currentStatus: AttendanceStatus | "unknown" = "unknown";

  if (isOnLeaveToday) {
    currentStatus = "leave";
  } else if (todayRecord?.status) {
    currentStatus = normalizeStatus(todayRecord.status);
  } else {
    // If no record for today, check if it's within working hours
    const hours = today.getHours();

    // If it's during working hours (9 AM - 5 PM) and no record, mark as absent
    if (hours >= 9 && hours < 17) {
      currentStatus = "absent";
    }
  }

  const greetingName = employee.firstName || employee.fullName || "Employee";

  return (
    <div className="bg-card rounded-lg border p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Welcome, {greetingName}!</h2>
          <p className="text-muted-foreground">{formatDate(new Date())}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Current Status:</span>
          <Badge
            className={cn(
              "font-medium capitalize",
              getStatusColor(currentStatus)
            )}
          >
            {getStatusText(currentStatus)}
          </Badge>
        </div>
      </div>
    </div>
  );
}

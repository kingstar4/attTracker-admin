"use client";

import { useEffect, useMemo } from "react";
import {
  CalendarClock,
  Clock4,
  LayoutDashboard,
  Users,
  UserCheck,
  UserCog,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SummaryCard } from "@/features/Owner/components/SummaryCard";
import {
  PendingLeave,
  AttendanceRecord,
  useOwnerDashboardStore,
} from "@/store/useOwnerDashboardStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { InviteUserModal } from "@/features/Owner/components/InviteUserModal";

const statusVariant = (status?: string) => {
  const normalized = status?.toString().toLowerCase();
  switch (normalized) {
    case "approved":
    case "present":
    case "completed":
      return "default" as const;
    case "pending":
    case "awaiting":
      return "secondary" as const;
    case "rejected":
    case "declined":
    case "absent":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
};

const formatDate = (value?: string, withTime = false) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return withTime
    ? date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const leaveRange = (leave: PendingLeave) => {
  if (leave.start_date && leave.end_date) {
    return `${formatDate(leave.start_date)} - ${formatDate(leave.end_date)}`;
  }
  if (leave.start_date || leave.end_date) {
    return formatDate(leave.start_date ?? leave.end_date);
  }
  return leave.created_at ? formatDate(leave.created_at) : "No schedule";
};

const attendanceTimestamp = (record: AttendanceRecord) => {
  if (record.clock_in || record.clock_out) {
    const start = record.clock_in ? formatDate(record.clock_in, true) : null;
    const end = record.clock_out ? formatDate(record.clock_out, true) : null;
    if (start && end) return `${start} - ${end}`;
    return start ?? end ?? formatDate(record.created_at, true);
  }
  if (record.attendance_date) return formatDate(record.attendance_date);
  return formatDate(record.created_at, true);
};

const asNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export default function OwnerDashboard() {
  const { fetchAll, loading, stats, pendingLeaves, recentAttendance, error } =
    useOwnerDashboardStore();
  const leaveRequests = useOwnerDashboardStore((state) => state.leaveRequests);
  const pendingLeaveCount = useOwnerDashboardStore(
    (state) => state.pendingLeaveCount
  );
  const { user } = useAuthStore();
  const { role, setRole, setUser: setUserStore } = useUserStore();

  useEffect(() => {
    if (user) setUserStore(user);
  }, [user, setUserStore]);

  useEffect(() => {
    if (!role && user?.role) setRole(user.role);
  }, [role, user, setRole]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const { supervisorCount, supervisorPending } = useMemo(() => {
    if (!stats) {
      return { supervisorCount: 0, supervisorPending: 0 };
    }

    const statsRecord = stats as Record<string, unknown>;
    const baseTotal = asNumber(statsRecord.total_supervisors) ?? 0;

    const pendingKeys = [
      "pending_supervisors",
      "pending_supervisor_accounts",
      "pending_supervisor_invitations",
      "supervisors_pending",
      "supervisors_pending_setup",
      "supervisors_invited",
    ];

    const completedKeys = [
      "active_supervisors",
      "completed_supervisors",
      "supervisors_completed",
      "supervisors_completed_setup",
      "supervisors_with_password",
    ];

    const pendingFromStats =
      pendingKeys
        .map((key) => asNumber(statsRecord[key]))
        .find((value): value is number => value !== null) ?? 0;

    const completedFromStats = completedKeys
      .map((key) => asNumber(statsRecord[key]))
      .find((value): value is number => value !== null);

    const activeSupervisors =
      completedFromStats ?? Math.max(baseTotal - pendingFromStats, 0);

    return {
      supervisorCount: activeSupervisors,
      supervisorPending: pendingFromStats > 0 ? pendingFromStats : 0,
    };
  }, [stats]);

  const summaryCards = useMemo(
    () => [
      {
        title: "Total Employees",
        value: stats?.total_employees ?? 0,
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Present Today",
        value: stats?.present_today ?? 0,
        icon: <UserCheck className="h-5 w-5" />,
      },
      {
        title: "Total Supervisors",
        value: supervisorCount,
        subtitle:
          supervisorPending > 0
            ? `${supervisorPending} pending setup`
            : undefined,
        icon: <UserCog className="h-5 w-5" />,
      },
      {
        title: "Leave Requests",
        value: pendingLeaveCount,
        icon: <CalendarClock className="h-5 w-5" />,
      },
    ],
    [stats, supervisorCount, supervisorPending, pendingLeaveCount]
  );

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5" />
          <h1 className="text-xl font-semibold">
            {user?.companyName
              ? `${user.firstName} Dashboard`
              : "Owner Dashboard"}
          </h1>
        </div>
        <InviteUserModal />
      </div>

      {error ? (
        <Card className="border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </Card>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading && !stats
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))
          : summaryCards.map((card) => (
              <SummaryCard
                key={card.title}
                title={card.title}
                value={card.value}
                icon={card.icon}
              />
            ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-4 sm:p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Pending Leave Requests</h3>
            <p className="text-xs text-muted-foreground">
              Latest leave applications awaiting action
            </p>
          </div>
          {loading && pendingLeaves.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : pendingLeaves.length > 0 ? (
            <div className="space-y-4">
              {pendingLeaves.map((leave, index) => (
                <div
                  key={
                    leave.id ?? `${leave.employee_name ?? "pending"}-${index}`
                  }
                  className="rounded-lg border p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">
                        {leave.employee_name ?? "Unnamed employee"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {leave.leave_type ?? "Leave"} • {leaveRange(leave)}
                      </p>
                    </div>
                    <Badge variant={statusVariant(leave.status)}>
                      {leave.status ? leave.status.toString() : "Pending"}
                    </Badge>
                  </div>
                  {leave.reason ? (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {leave.reason}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No pending leave requests right now.
            </p>
          )}
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Recent Attendance</h3>
            <p className="text-xs text-muted-foreground">
              Snapshot of the most recent punches
            </p>
          </div>
          {loading && recentAttendance.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : recentAttendance.length > 0 ? (
            <div className="space-y-4">
              {recentAttendance.map((record, index) => (
                <div
                  key={
                    record.id ??
                    `${record.employee_name ?? "attendance"}-${index}`
                  }
                  className="rounded-lg border p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">
                        {record.employee_name ?? "Unnamed employee"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {attendanceTimestamp(record)}
                      </p>
                    </div>
                    <Badge variant={statusVariant(record.status)}>
                      {record.status ? record.status.toString() : "Recorded"}
                    </Badge>
                  </div>
                  {record.clock_in || record.clock_out ? (
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {record.clock_in ? (
                        <span className="flex items-center gap-1">
                          <Clock4 className="h-3.5 w-3.5" />
                          In: {formatDate(record.clock_in, true)}
                        </span>
                      ) : null}
                      {record.clock_out ? (
                        <span className="flex items-center gap-1">
                          <Clock4 className="h-3.5 w-3.5" />
                          Out: {formatDate(record.clock_out, true)}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No attendance records available yet.
            </p>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">All Leave Requests</h3>
          <p className="text-xs text-muted-foreground">
            Full history of recent leave requests with their approval status.
          </p>
        </div>
        {loading && leaveRequests.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : leaveRequests.length > 0 ? (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-4 text-left font-medium">Employee</th>
                    <th className="py-2 pr-4 text-left font-medium">Type</th>
                    <th className="py-2 pr-4 text-left font-medium">Dates</th>
                    <th className="py-2 pr-4 text-left font-medium">Status</th>
                    <th className="py-2 pr-4 text-left font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((leave, index) => (
                    <tr
                      key={leave.id ?? `${leave.employee_name ?? "leave"}-${index}`}
                      className="border-b last:border-0"
                    >
                      <td className="py-3 pr-4 font-medium">
                        {leave.employee_name ?? "Unnamed employee"}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {leave.leave_type ?? "Leave"}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {leaveRange(leave)}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={statusVariant(leave.status)}>
                          {leave.status ?? "Pending"}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {leave.created_at ? formatDate(leave.created_at, true) : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {leaveRequests.map((leave, index) => (
                <div
                  key={leave.id ?? `${leave.employee_name ?? "leave"}-${index}`}
                  className="rounded-lg border p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">
                        {leave.employee_name ?? "Unnamed employee"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {leave.leave_type ?? "Leave"} · {leaveRange(leave)}
                      </p>
                    </div>
                    <Badge variant={statusVariant(leave.status)}>
                      {leave.status ?? "Pending"}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Submitted:{" "}
                    {leave.created_at ? formatDate(leave.created_at, true) : "N/A"}
                  </p>
                  {leave.reason ? (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-3">
                      {leave.reason}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No leave requests have been recorded yet.
          </p>
        )}
      </Card>
    </div>
  );
}

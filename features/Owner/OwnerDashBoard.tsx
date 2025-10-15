"use client";

import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { useOwnerDashboardStore } from "@/store/useOwnerDashboardStore";
import { SummaryCard } from "@/features/Owner/components/SummaryCard";
import { AttendanceTrendChart } from "@/features/Owner/components/AttendanceTrendChart";
import { ProjectsList } from "@/features/Owner/components/ProjectsList";
import { ActivityFeed } from "@/features/Owner/components/ActivityFeed";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { InviteUserModal } from "@/features/Owner/components/InviteUserModal";

export default function OwnerDashboard() {
  const { fetchAll, loading, summary, trends, projects, activity } =
    useOwnerDashboardStore();
  const { user } = useAuthStore();
  const { role, setRole } = useUserStore();

  useEffect(() => {
    if (!role && user?.role) setRole(user.role);
  }, [role, user, setRole]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5" />
          <h1 className="text-xl font-semibold">Owner Dashboard</h1>
        </div>
        <InviteUserModal projects={projects} />
      </div>

      {/* Top summary */}
      {loading && !summary ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : summary ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Employees"
            value={summary.totalEmployees}
            icon={<Users className="h-5 w-5" />}
          />
          <SummaryCard
            title="Active Projects"
            value={summary.activeProjects}
            icon={<Building2 className="h-5 w-5" />}
          />
          <SummaryCard
            title="Attendance Rate (Today)"
            value={`${summary.attendanceToday}%`}
            icon={<TrendingUp className="h-5 w-5" />}
            subtitle="vs. baseline"
          />
          <SummaryCard
            title="Active Supervisors"
            value={summary.activeSupervisors}
            icon={<ShieldCheck className="h-5 w-5" />}
          />
        </div>
      ) : null}

      {/* Middle: chart + projects */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {loading && trends.length === 0 ? (
            <Skeleton className="h-80" />
          ) : (
            <AttendanceTrendChart data={trends} />
          )}
        </div>
        <div className="lg:col-span-1">
          {loading && projects.length === 0 ? (
            <Skeleton className="h-80" />
          ) : (
            <ProjectsList projects={projects} />
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-6">
        {loading && activity.length === 0 ? (
          <Skeleton className="h-60" />
        ) : (
          <ActivityFeed items={activity} />
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useOwnerSupervisorsStore } from "@/store/useOwnerSupervisorsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { SupervisorsTeamsCard } from "./components/SupervisorsTeamsCard";

const statusVariant = (status: "pending" | "verified") => {
  switch (status) {
    case "verified":
      return "default" as const;
    case "pending":
    default:
      return "secondary" as const;
  }
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function OwnerSupervisorsPage() {
  const { fetchOwnerSupervisors, supervisors, loading, error, lastFetchedAt } =
    useOwnerSupervisorsStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user || user.role !== "owner") return;
    void fetchOwnerSupervisors(
      { ownerId: user.id, ownerEmail: user.email },
      { force: true }
    );
  }, [fetchOwnerSupervisors, user]);

  const { verifiedCount, pendingCount } = useMemo(() => {
    const verified = supervisors.filter(
      (item) => item.status === "verified"
    ).length;
    return {
      verifiedCount: verified,
      pendingCount: supervisors.length - verified,
    };
  }, [supervisors]);

  const supervisorsByOrg = useMemo(() => {
    const map = new Map<string, typeof supervisors>();
    supervisors.forEach((supervisor) => {
      const key = `${supervisor.organizationId}:${supervisor.organizationName}`;
      const list = map.get(key) ?? [];
      list.push(supervisor);
      map.set(key, list);
    });
    return Array.from(map.entries()).map(([key, list]) => {
      const [, name] = key.split(":");
      return { organizationName: name ?? "Organization", supervisors: list };
    });
  }, [supervisors]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Supervisors Directory</h1>
        <p className="text-muted-foreground">
          Track every supervisor invitation and each supervisor&apos;s team at a
          glance.
        </p>
        {lastFetchedAt ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Last updated: {formatDate(lastFetchedAt)}
          </p>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Supervisors
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading && supervisors.length === 0 ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              supervisors.length
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verified Supervisors
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-green-600 dark:text-green-500">
            {loading && supervisors.length === 0 ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              verifiedCount
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-yellow-600 dark:text-yellow-500">
            {loading && supervisors.length === 0 ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              pendingCount
            )}
          </CardContent>
        </Card>
      </div>

      <div className="w-full">
        <SupervisorsTeamsCard
          loading={loading}
          supervisors={supervisors}
          supervisorsByOrg={supervisorsByOrg}
          statusVariant={statusVariant}
        />
      </div>
    </div>
  );
}

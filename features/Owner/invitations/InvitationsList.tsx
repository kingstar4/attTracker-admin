"use client";

import { useEffect } from "react";
import { Invitation, useInvitationStore } from "@/store/useInvitationStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useOwnerSupervisorsStore } from "@/store/useOwnerSupervisorsStore";
import { useAuthStore } from "@/store/useAuthStore";

const statusColor: Record<Invitation["status"], string> = {
  pending: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  accepted: "bg-green-500/15 text-green-600 dark:text-green-400",
  expired: "bg-red-500/15 text-red-600 dark:text-red-400",
};

export function InvitationsList() {
  const { invites, resendInvite, revokeInvite, loading } = useInvitationStore();
  const { toast } = useToast();
  const {
    supervisors,
    loading: supervisorsLoading,
    error: supervisorsError,
    fetchOwnerSupervisors,
  } = useOwnerSupervisorsStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user || user.role !== "owner") return;
    void fetchOwnerSupervisors({ ownerId: user.id, ownerEmail: user.email });
  }, [fetchOwnerSupervisors, user]);

  const handleResend = async (id: string) => {
    try {
      await resendInvite(id);
      toast({ title: "Invitation resent" });
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message });
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await revokeInvite(id);
      toast({ title: "Invitation revoked" });
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message });
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">Supervisors by Status</h3>
          <p className="text-xs text-muted-foreground">
            Snapshot of every supervisor linked to your{" "}
            {supervisors.find((s) => s.organizationName)?.organizationName ||
              "organization"}
          </p>
        </div>
        {supervisorsError ? (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {supervisorsError}
          </div>
        ) : null}
        <div className="hidden overflow-x-auto md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supervisor</TableHead>
                <TableHead>Email</TableHead>
                {/* <TableHead>Created</TableHead> */}
                <TableHead>Status</TableHead>
                <TableHead>Employees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supervisorsLoading && supervisors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="h-6 w-full animate-pulse rounded bg-muted" />
                  </TableCell>
                </TableRow>
              ) : supervisors.length > 0 ? (
                supervisors.map((supervisor) => (
                  <TableRow key={supervisor.id}>
                    <TableCell>{supervisor.name}</TableCell>
                    <TableCell>{supervisor.email || "N/A"}</TableCell>
                    {/* <TableCell>{formatDate(supervisor.createdAt)}</TableCell> */}
                    <TableCell>
                      <Badge
                        variant={
                          supervisor.status === "verified"
                            ? "default"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {supervisor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{supervisor.employees.length}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-sm text-muted-foreground"
                  >
                    No supervisor records were returned.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="space-y-3 md:hidden">
          {supervisorsLoading && supervisors.length === 0 ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : supervisors.length > 0 ? (
            supervisors.map((supervisor) => (
              <div
                key={supervisor.id}
                className="rounded-lg border border-border/70 bg-background p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-semibold">{supervisor.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {supervisor.email || "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        supervisor.status === "verified"
                          ? "default"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {supervisor.status}
                    </Badge>
                    <div className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {supervisor.employees.length} employee
                      {supervisor.employees.length === 1 ? "" : "s"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No supervisor records were returned.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

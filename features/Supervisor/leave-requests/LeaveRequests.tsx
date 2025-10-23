"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSupervisorStore } from "@/store/useSupervisorStore";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

export function LeaveRequests() {
  const { toast } = useToast();
  const { leaveRequests, fetchLeaveRequests, updateLeaveRequest, loading } =
    useSupervisorStore();

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  const handleUpdateStatus = async (
    leaveId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await updateLeaveRequest(leaveId, status);
      toast({
        title: "Success",
        description: `Leave request ${status} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const renderActions = (requestId: string) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        className="flex items-center gap-1"
        onClick={() => handleUpdateStatus(requestId, "approved")}
        disabled={loading}
      >
        <CheckCircle className="h-4 w-4" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="destructive"
        className="flex items-center gap-1"
        onClick={() => handleUpdateStatus(requestId, "rejected")}
        disabled={loading}
      >
        <XCircle className="h-4 w-4" />
        Reject
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">Leave Requests</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Manage employee leave requests
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
          <CardDescription>
            Review and manage leave requests from your employees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  {/* <TableHead>Type</TableHead> */}
                  <TableHead>Period</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.employee_name}
                    </TableCell>
                    {/* <TableCell className="capitalize">{request.type}</TableCell> */}
                    <TableCell>
                      {format(new Date(request.start_date), "MMM d, yyyy")} -{" "}
                      {format(new Date(request.end_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.status === "pending" ? (
                        renderActions(request.id)
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No actions available
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {leaveRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-6 text-center">
                      No leave requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {leaveRequests.length > 0 ? (
              leaveRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-lg border border-border/70 bg-background p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">
                      {request.employee_name}
                    </p>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <dl className="mt-3 space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between gap-2">
                      <dt className="font-medium text-foreground">Period</dt>
                      <dd>
                        {format(new Date(request.start_date), "MMM d, yyyy")} -{" "}
                        {format(new Date(request.end_date), "MMM d, yyyy")}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-foreground">Reason</dt>
                      <dd className="mt-1">{request.reason}</dd>
                    </div>
                  </dl>
                  {request.status === "pending" ? (
                    <div className="mt-3">{renderActions(request.id)}</div>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                No leave requests found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

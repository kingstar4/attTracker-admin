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
import { History, Calendar, Clock, FileText } from "lucide-react";

export function LeaveRequestHistory() {
  const { leaveRequests } = useEmployeeModuleStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-present text-white";
      case "pending":
        return "bg-navbar text-white";
      case "rejected":
        return "bg-absent text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSubmittedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Request History
        </CardTitle>
        <CardDescription>
          View all your previous leave requests and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leaveRequests.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No leave requests found</p>
            <p className="text-sm text-muted-foreground">
              Your submitted requests will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">
                      Submitted
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Reason</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Leave Time
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((request) => (
                    <tr key={request.id} className="border-b">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatSubmittedDate(request.submittedAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium">
                        {request.reason}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatDateTime(request.expectedLeaveTime)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          className={cn(
                            "capitalize",
                            getStatusColor(request.status)
                          )}
                        >
                          {request.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground max-w-xs truncate">
                        {request.details || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {leaveRequests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{request.reason}</h4>
                    <Badge
                      className={cn(
                        "capitalize",
                        getStatusColor(request.status)
                      )}
                    >
                      {request.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Submitted: {formatSubmittedDate(request.submittedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        Leave: {formatDateTime(request.expectedLeaveTime)}
                      </span>
                    </div>
                  </div>

                  {request.details && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Details:</strong> {request.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

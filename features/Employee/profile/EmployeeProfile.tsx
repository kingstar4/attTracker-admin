"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEmployeeModuleStore } from "@/store/useEmployeeModuleStore";
import {
  Mail,
  Phone,
  MapPin,
  User,
  ShieldCheck,
  Users,
  Calendar,
} from "lucide-react";

type Props = {
  employeeId?: string;
};
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs uppercase tracking-wide text-muted-foreground">
      {label}
    </span>
    <span className="text-sm font-medium text-foreground">
      {value || "Not provided"}
    </span>
  </div>
);

export function EmployeeProfile({ employeeId }: Props) {
  const fetchEmployeeProfile = useEmployeeModuleStore(
    (state) => state.fetchEmployeeProfile
  );
  const { employee, profileLoading, profileError } = useEmployeeModuleStore();

  useEffect(() => {
    void fetchEmployeeProfile();
  }, [fetchEmployeeProfile]);

  if (profileLoading && !employee) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-32 bg-muted rounded" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-4 w-48 bg-muted rounded" />
            <div className="h-4 w-40 bg-muted rounded" />
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-5 w-24 bg-muted rounded" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileError && !employee) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">
            Unable to load profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{profileError}</p>
        </CardContent>
      </Card>
    );
  }

  if (!employee) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">
                {employee.fullName ||
                  `${employee.firstName} ${employee.lastName}`}
              </CardTitle>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={employee.isActive ? "secondary" : "destructive"}>
                {employee.isActive ? "Active" : "Inactive"}
              </Badge>
              {employee.emailVerified && (
                <Badge variant="outline">Email Verified</Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{employee.email || "No email on file"}</span>
            </div>
            {employee.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{employee.phoneNumber}</span>
              </div>
            )}
            {employee.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{employee.address}</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow label="Role" value={employee.role} />
            <InfoRow label="Employee ID" value={employee.id} />
            <InfoRow label="Organization ID" value={employee.organizationId} />
            <InfoRow label="NIN" value={employee.nin} />
            <InfoRow
              label="Date Joined"
              value={
                employee.createdAt
                  ? new Date(employee.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : undefined
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-navbar" />
              Supervisor & Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                Supervisor
              </h3>
              <InfoRow label="Name" value={employee.supervisorName} />
              <InfoRow label="Phone Number" value={employee.supervisorPhone} />
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                Emergency Contact
              </h3>
              <InfoRow label="Name" value={employee.emergencyContactName} />
              <InfoRow
                label="Phone Number"
                value={employee.emergencyContactPhone}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            Quick Facts
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <InfoRow label="Email" value={employee.email} />
          <InfoRow label="Phone" value={employee.phoneNumber} />
          <InfoRow label="Address" value={employee.address} />
          <InfoRow
            label="Status"
            value={employee.isActive ? "Active" : "Inactive"}
          />
        </CardContent>
      </Card>
    </div>
  );
}

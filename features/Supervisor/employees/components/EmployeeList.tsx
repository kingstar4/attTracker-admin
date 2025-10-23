"use client";

import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function EmployeeList() {
  const { employees, isLoading, deleteEmployee, fetchEmployees } =
    useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="text-muted-foreground">Loading employees...</div>
      </div>
    );
  }

  const verifiedEmployees = employees.filter((emp) => emp.email_verified);
  const unverifiedCount = employees.length - verifiedEmployees.length;

  if (employees.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="text-muted-foreground">No employees found</div>
        <p className="text-sm text-muted-foreground">
          Add your first employee using the button above
        </p>
      </div>
    );
  }

  if (verifiedEmployees.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="text-muted-foreground">No verified employees found</div>
        <p className="text-sm text-muted-foreground">
          Please wait for employees to verify their email addresses
        </p>
      </div>
    );
  }

  const renderActions = (employeeId: string) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => console.log("Edit", employeeId)}
          className="text-blue-600"
        >
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to delete this employee?"
              )
            ) {
              deleteEmployee(employeeId);
            }
          }}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const statusBadge = (isActive: boolean) => (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );

  return (
    <div className="space-y-4">
      {unverifiedCount > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>
            {unverifiedCount} employee{unverifiedCount > 1 ? "s" : ""} pending
            email verification
          </AlertDescription>
        </Alert>
      )}

      <div className="hidden overflow-x-auto rounded-md border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>NIN</TableHead>
              <TableHead>Emergency Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verifiedEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{`${employee.first_name} ${employee.last_name}`}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone_number}</TableCell>
                <TableCell>{employee.nin}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{employee.emergency_contact_name}</div>
                    <div className="text-muted-foreground">
                      {employee.emergency_contact_phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{statusBadge(employee.is_active)}</TableCell>
                <TableCell>{renderActions(employee.id)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {verifiedEmployees.map((employee) => (
          <div
            key={employee.id}
            className="rounded-lg border border-border/60 bg-background p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{`${employee.first_name} ${employee.last_name}`}</p>
                <p className="text-xs text-muted-foreground">{employee.email}</p>
              </div>
              {statusBadge(employee.is_active)}
            </div>

            <dl className="mt-3 space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between gap-2">
                <dt className="font-medium text-foreground">Phone</dt>
                <dd>{employee.phone_number || "N/A"}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="font-medium text-foreground">NIN</dt>
                <dd className="truncate">{employee.nin || "N/A"}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">
                  Emergency Contact
                </dt>
                <dd className="mt-1">
                  <span>{employee.emergency_contact_name || "N/A"}</span>
                  <span className="ml-2 block sm:inline">
                    {employee.emergency_contact_phone || ""}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="mt-3 flex justify-end">{renderActions(employee.id)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

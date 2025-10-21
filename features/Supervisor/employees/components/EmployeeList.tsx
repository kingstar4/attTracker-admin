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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEmployeeStore } from "@/store/useEmployeeStore";

export function EmployeeList() {
  const { employees, isLoading, deleteEmployee, fetchEmployees } =
    useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">Loading employees...</div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">No employees found</div>
        <p className="text-sm text-muted-foreground">
          Add your first employee using the button above
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
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
          {employees.map((employee) => (
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
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    employee.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {employee.is_active ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell>
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
                      onClick={() => console.log("Edit", employee.id)}
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
                          deleteEmployee(employee.id);
                        }
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

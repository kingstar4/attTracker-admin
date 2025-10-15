"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type EmployeeInfoCardProps } from "../types"

const mockEmployees = [
  {
    id: "1",
    fullName: "John Doe",
    employeeId: "EMP001",
    department: "IT",
    role: "Developer",
    site: "Main Office",
  },
  // Add more mock employees as needed
]

export function EmployeeInfoCard({ employee, onSelectEmployee }: EmployeeInfoCardProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Employee Information</h2>

      <div className="space-y-4">
        <div className="w-full">
          <Label htmlFor="employee">Select Employee</Label>
          <Select
            onValueChange={(value) => {
              const selected = mockEmployees.find((emp) => emp.id === value)
              if (selected) onSelectEmployee(selected)
            }}
            value={employee?.id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an employee" />
            </SelectTrigger>
            <SelectContent>
              {mockEmployees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.employeeId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {employee && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Employee ID</Label>
              <p>{employee.employeeId}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Department</Label>
              <p>{employee.department}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Role</Label>
              <p>{employee.role}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Site</Label>
              <p>{employee.site}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
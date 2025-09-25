"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Employee {
  id: string
  name: string
  department: string
  status: "in" | "out" | "break"
  fingerprintEnrolled: boolean
}

interface EmployeeSelectorProps {
  employees: Employee[]
  searchTerm: string
  onSelect: (employeeId: string) => void
  onBack: () => void
}

export function EmployeeSelector({ employees, searchTerm, onSelect, onBack }: EmployeeSelectorProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "break":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "out":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h3 className="font-semibold">Select Employee</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? `Showing results for "${searchTerm}"` : "All employees"}
          </p>
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-1 gap-3">
          {employees.map((employee) => (
            <Button
              key={employee.id}
              variant="outline"
              className="h-auto p-4 justify-start bg-transparent"
              onClick={() => onSelect(employee.id)}
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-left">
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-muted-foreground">{employee.department}</div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
                  {employee.fingerprintEnrolled && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Enrolled
                    </div>
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>

        {employees.length === 0 && (
          <div className="text-center py-8">
            <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No employees found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search</p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

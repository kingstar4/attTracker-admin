"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { UserPlus } from "lucide-react"
import { useEmployeeStore } from "@/store/useEmployeeStore"
import { AddEmployeeForm } from "./components/AddEmployeeForm"
import { EmployeeList } from "./components/EmployeeList"

export function Employees() {
  const { fetchEmployees } = useEmployeeStore()

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-muted-foreground">
            Add and manage employees in your organization
          </p>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Add New Employee</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <AddEmployeeForm onSuccess={() => fetchEmployees()} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
          <CardDescription>
            View and manage all employees in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeList />
        </CardContent>
      </Card>
    </div>
  )
}

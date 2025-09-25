import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Employee } from "@/types/employee"

// This is a temporary in-memory store for demo purposes
// In a real app, you would use a database
let employees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "08012345678",
    address: "123 Main Street, Lagos",
    nin: "12345678901",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  // In a real app, you would fetch from your database
  return NextResponse.json(employees)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // In a real app, validate the data and save to database
    const newEmployee: Employee = {
      id: String(employees.length + 1),
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    }

    employees.push(newEmployee)

    // In a real app, you would send an email here with the password setup link
    // For now, we'll just return the new employee
    return NextResponse.json(newEmployee, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 400 }
    )
  }
}
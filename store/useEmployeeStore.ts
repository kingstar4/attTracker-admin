"use client"

import { create } from "zustand"
import { CreateEmployeeDto, Employee } from "@/types/employee"

interface EmployeeStore {
  employees: Employee[]
  isLoading: boolean
  error: string | null
  selectedEmployee: Employee | null
  
  // Actions
  fetchEmployees: () => Promise<void>
  createEmployee: (data: CreateEmployeeDto) => Promise<void>
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>
  deleteEmployee: (id: string) => Promise<void>
  setPassword: (token: string, password: string) => Promise<void>
  setSelectedEmployee: (employee: Employee | null) => void
  setError: (error: string | null) => void
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  isLoading: false,
  error: null,
  selectedEmployee: null,

  fetchEmployees: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/employees")
      if (!response.ok) throw new Error("Failed to fetch employees")
      const data = await response.json()
      set({ employees: data, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  createEmployee: async (data: CreateEmployeeDto) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) throw new Error("Failed to create employee")
      const newEmployee = await response.json()
      
      set((state) => ({
        employees: [...state.employees, newEmployee],
        isLoading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error // Re-throw for form handling
    }
  },

  updateEmployee: async (id: string, data: Partial<Employee>) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) throw new Error("Failed to update employee")
      const updatedEmployee = await response.json()
      
      set((state) => ({
        employees: state.employees.map((emp) => 
          emp.id === id ? updatedEmployee : emp
        ),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  deleteEmployee: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) throw new Error("Failed to delete employee")
      
      set((state) => ({
        employees: state.employees.filter((emp) => emp.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
  setError: (error) => set({ error }),

  setPassword: async (token: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/employees/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      
      if (!response.ok) throw new Error("Failed to set password")
      set({ isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },
}))
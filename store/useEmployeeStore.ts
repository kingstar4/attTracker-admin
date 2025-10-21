"use client"

import { create } from "zustand"
import { CreateEmployeeDto, Employee } from "@/types/employee"
import api from "@/lib/api"

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
      const response = await api.get("/supervisor/employees")
      if (!response.data) throw new Error("No data received from server")
      set({ employees: response.data.data || response.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, isLoading: false })
    }
  },

  createEmployee: async (data: CreateEmployeeDto) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post("/supervisor/employees", data)
      const newEmployee = response.data.data || response.data
      
      set((state) => ({
        employees: [...state.employees, newEmployee],
        isLoading: false,
      }))
    } catch (error: any) {
      const message = error.response?.data?.message || error.message
      set({ error: message, isLoading: false })
      throw new Error(message)
    }
  },

  updateEmployee: async (id: string, data: Partial<Employee>) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.patch(`/supervisor/employees/${id}`, data)
      const updatedEmployee = response.data.data || response.data
      
      set((state) => ({
        employees: state.employees.map((emp) => 
          emp.id === id ? updatedEmployee : emp
        ),
        isLoading: false,
      }))
    } catch (error: any) {
      const message = error.response?.data?.message || error.message
      set({ error: message, isLoading: false })
      throw new Error(message)
    }
  },

  deleteEmployee: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/supervisor/employees/${id}`)
      
      set((state) => ({
        employees: state.employees.filter((emp) => emp.id !== id),
        isLoading: false,
      }))
    } catch (error: any) {
      const message = error.response?.data?.message || error.message
      set({ error: message, isLoading: false })
      throw new Error(message)
    }
  },

  setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
  setError: (error) => set({ error }),

  setPassword: async (token: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      await api.post("/supervisor/employees/set-password", { token, password })
      set({ isLoading: false })
    } catch (error: any) {
      const message = error.response?.data?.message || error.message
      set({ error: message, isLoading: false })
      throw new Error(message)
    }
  },
}))
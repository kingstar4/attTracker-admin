"use client"

import { create } from "zustand"
import api from "@/lib/api"
// import { useEmployeeStore } from "./useEmployeeStore"

export interface LeaveRequest {
  id: string
  employee_id: string
  employee_name: string
  start_date: string
  end_date: string
  reason: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  type: "sick" | "vacation" | "personal"
}

export interface EmployeeAttendance {
  id: string
  name: string
  email: string
  status: "present" | "absent" | "on_leave" | "on_break"
  clock_in_time: string | null
  clock_out_time: string | null
  method: "fingerprint" | "otp" | null
}

export interface DailyAttendance {
  date: string
  employees: EmployeeAttendance[]
}

export interface WeeklyAttendanceData {
  date: string
  total: number
  present: number
  onBreak: number
  absent: number
}

interface SupervisorState {
  leaveRequests: LeaveRequest[]
  todayAttendance: DailyAttendance | null
  weeklyAttendance: WeeklyAttendanceData[]
  loading: boolean
  error: string | null
  fetchLeaveRequests: () => Promise<void>
  updateLeaveRequest: (leaveId: string, status: "approved" | "rejected") => Promise<void>
  fetchTodayAttendance: () => Promise<void>
//   fetchWeeklyAttendance: () => Promise<void>
}

export const useSupervisorStore = create<SupervisorState>((set, get) => ({
  leaveRequests: [],
  todayAttendance: null,
  weeklyAttendance: [],
  loading: false,
  error: null,

  fetchLeaveRequests: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get("/supervisor/leave-requests")
      set({ leaveRequests: response.data.data || response.data })
    } catch (error: any) {
      const message = error.response?.data?.message || error.message
      set({ error: message })
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  },

  updateLeaveRequest: async (leaveId: string, status: "approved" | "rejected") => {
    set({ loading: true, error: null })
    try {
      await api.put(`/supervisor/leave-requests/${leaveId}`, { status })
      // Refresh leave requests after update
      await get().fetchLeaveRequests()
    } catch (error: any) {
      const message = error.response?.data?.message || error.message
      set({ error: message })
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  },

  fetchTodayAttendance: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get("/supervisor/attendance/today")
      set({ todayAttendance: response.data.data || response.data })
    
    } catch (error: any) {
      const message = error.response?.data?.message || error.message
      set({ error: message })
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  },


}))
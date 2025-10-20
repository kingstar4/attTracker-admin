"use client"

import { create } from "zustand"
import api from "@/lib/api"

export interface OrganizationStats {
  pending_leave_requests: number
  present_today: number
  total_employees: number
  total_supervisors: number
  [key: string]: unknown
}

export interface PendingLeave {
  id?: string
  employee_name?: string
  leave_type?: string
  start_date?: string
  end_date?: string
  status?: string
  reason?: string
  created_at?: string
  [key: string]: unknown
}

export interface AttendanceRecord {
  id?: string
  employee_name?: string
  status?: string
  clock_in?: string
  clock_out?: string
  attendance_date?: string
  created_at?: string
  [key: string]: unknown
}

interface OwnerDashboardState {
  loading: boolean
  error: string | null
  stats: OrganizationStats | null
  pendingLeaves: PendingLeave[]
  recentAttendance: AttendanceRecord[]
  fetchAll: () => Promise<void>
}

const defaultStats: OrganizationStats = {
  pending_leave_requests: 0,
  present_today: 0,
  total_employees: 0,
  total_supervisors: 0,
}

export const useOwnerDashboardStore = create<OwnerDashboardState>((set) => ({
  loading: false,
  error: null,
  stats: null,
  pendingLeaves: [],
  recentAttendance: [],

  fetchAll: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get("/owner/dashboard")
      const payload = response.data?.data ?? response.data ?? {}

      set({
        stats: payload.organization_stats ?? defaultStats,
        pendingLeaves: Array.isArray(payload.pending_leaves) ? payload.pending_leaves : [],
        recentAttendance: Array.isArray(payload.recent_attendance) ? payload.recent_attendance : [],
        loading: false,
        error: null,
      })
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to load dashboard data"
      const isNetworkError =
        typeof message === "string" && message.toLowerCase().includes("network error")

      set({
        stats: defaultStats,
        pendingLeaves: [],
        recentAttendance: [],
        loading: false,
        error: isNetworkError ? null : message,
      })

      const logMethod = isNetworkError ? console.warn : console.error
      logMethod("Owner dashboard fetch issue:", message)
    }
  },
}))

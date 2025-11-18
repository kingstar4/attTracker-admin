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
  employee_id?: string
  employee_email?: string
  leave_type?: string
  start_date?: string
  end_date?: string
  status?: string
  reason?: string
  created_at?: string
  approved_at?: string
  supervisor_id?: string
  supervisor_name?: string
  supervisor_email?: string
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
  leaveRequests: PendingLeave[]
  supervisorLeaveRequests: PendingLeave[]
  recentAttendance: AttendanceRecord[]
  pendingLeaveCount: number
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
  leaveRequests: [],
  supervisorLeaveRequests: [],
  recentAttendance: [],
  pendingLeaveCount: 0,

  fetchAll: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get("/owner/dashboard")
      const payload = response.data?.data ?? response.data ?? {}

      const toLeaveRecord = (item: unknown, index: number): PendingLeave => {
        if (!item || typeof item !== "object") {
          return { id: `${index}` }
        }
        const record = item as Record<string, unknown>

        const safeString = (value: unknown, fallback = ""): string => {
          if (value === undefined || value === null) return fallback
          if (typeof value === "string") return value
          if (typeof value === "number" && Number.isFinite(value)) return String(value)
          return fallback
        }

        const normalizeStatus = (value: unknown): string => {
          const raw = safeString(value).toLowerCase()
          if (raw.includes("approve")) return "approved"
          if (raw.includes("reject")) return "rejected"
          if (raw.includes("pending")) return "pending"
          return raw || "pending"
        }

        return {
          id: safeString(
            record.id ??
              record.leave_id ??
              record.request_id ??
              record.uuid ??
              record.reference ??
              `${index}`,
          ),
          employee_name: safeString(
            record.employee_name ??
              record.employee ??
              record.staff_name ??
              record.user_name ??
              "",
          ),
          employee_id: safeString(
            record.employee_id ??
              record.employeeId ??
              record.staff_id ??
              record.staffId ??
              "",
          ),
          employee_email: safeString(
            record.employee_email ??
              record.email ??
              record.employeeEmail ??
              record.staff_email ??
              "",
          ),
          leave_type: safeString(
            record.leave_type ??
              record.type ??
              record.category ??
              record.reason_type ??
              "Leave",
          ),
          start_date: safeString(
            record.start_date ??
              record.startDate ??
              record.begin_date ??
              record.leave_start ??
              "",
          ),
          end_date: safeString(
            record.end_date ??
              record.endDate ??
              record.finish_date ??
              record.leave_end ??
              "",
          ),
          status: normalizeStatus(
            record.status ?? record.leave_status ?? record.approval_status,
          ),
          reason: safeString(record.reason ?? record.description ?? ""),
          created_at: safeString(
            record.created_at ??
              record.requested_at ??
              record.updated_at ??
              record.submitted_at ??
              "",
          ),
          approved_at: safeString(
            record.approved_at ??
              record.approvedAt ??
              record.approved_on ??
              record.resolved_at ??
              "",
          ),
          supervisor_id: safeString(
            record.supervisor_id ??
              record.supervisorId ??
              record.manager_id ??
              record.managerId ??
              "",
          ),
          supervisor_name: safeString(
            record.supervisor_name ??
              record.supervisor ??
              record.manager_name ??
              record.manager ??
              "",
          ),
          supervisor_email: safeString(
            record.supervisor_email ??
              record.supervisorEmail ??
              record.manager_email ??
              record.managerEmail ??
              "",
          ),
        }
      }

      const resolveLeaveArray = (source: unknown): PendingLeave[] => {
        if (!Array.isArray(source)) return []
        return source.map((item, index) => toLeaveRecord(item, index))
      }

      const supervisorLeaveRequests = resolveLeaveArray(payload.all_leave_requests)

      const leaveRequestsSource = resolveLeaveArray(payload.leave_requests)
      const recentLeaveRequests = resolveLeaveArray(payload.recent_leave_requests)

      const leaveRequestsRaw =
        supervisorLeaveRequests.length > 0
          ? supervisorLeaveRequests
          : leaveRequestsSource.length > 0
            ? leaveRequestsSource
            : recentLeaveRequests

      const pendingLeavesRaw = resolveLeaveArray(payload.pending_leaves)
      const leaveRequests =
        leaveRequestsRaw.length > 0
          ? leaveRequestsRaw
          : pendingLeavesRaw

      const pendingLeaves =
        pendingLeavesRaw.length > 0
          ? pendingLeavesRaw
          : leaveRequests.filter(
              (leave) => leave.status?.toLowerCase() === "pending",
            )

      const statsSource = payload.organization_stats ?? defaultStats
      const derivePendingCount = (): number => {
        const raw =
          statsSource?.pending_leave_requests ??
          payload.pending_leave_requests ??
          payload.pending_leaves_count

        if (typeof raw === "number" && Number.isFinite(raw)) return raw
        if (typeof raw === "string" && raw.trim() !== "") {
          const parsed = Number(raw)
          if (Number.isFinite(parsed)) return parsed
        }
        return pendingLeaves.length
      }

      set({
        stats: statsSource ?? defaultStats,
        pendingLeaves,
        leaveRequests,
        supervisorLeaveRequests,
        recentAttendance: Array.isArray(payload.recent_attendance)
          ? payload.recent_attendance
          : [],
        pendingLeaveCount: derivePendingCount(),
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
        leaveRequests: [],
        supervisorLeaveRequests: [],
        recentAttendance: [],
        pendingLeaveCount: 0,
        loading: false,
        error: isNetworkError ? null : message,
      })

      const logMethod = isNetworkError ? console.warn : console.error
      logMethod("Owner dashboard fetch issue:", message)
    }
  },
}))

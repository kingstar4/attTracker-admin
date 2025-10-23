"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import api from "@/lib/api"

export type AttendanceStatus = "present" | "absent" | "late" | "leave"

export interface EmployeeProfile {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phoneNumber?: string
  address?: string
  role?: string
  organizationId?: string
  isActive?: boolean
  emailVerified?: boolean
  emergencyContactName?: string
  emergencyContactPhone?: string
  nin?: string
  createdAt?: string
  supervisorId?: string
  supervisorName?: string
  supervisorPhone?: string
}

export interface AttendanceRecord {
  id: string
  date: string
  clockIn?: string
  clockOut?: string
  status: AttendanceStatus
  notes?: string
}

export interface LeaveRequest {
  id: string
  start_date: string
  end_date: string
  reason: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

export interface AttendanceSummary {
  attendancePercentage: number
  daysPresentThisMonth: number
  totalWorkingDays: number
}

interface EmployeeState {
  employee: EmployeeProfile | null
  attendanceSummary: AttendanceSummary | null
  attendanceRecords: AttendanceRecord[]
  attendanceHistory: AttendanceRecord[]
  attendanceHistoryFilters: { startDate?: string; endDate?: string } | null
  attendanceHistoryLoading: boolean
  attendanceHistoryError: string | null
  leaveRequests: LeaveRequest[]
  leaveRequestsLoading: boolean
  leaveRequestsError: string | null
  leaveRequestSubmitting: boolean
  sidebarCollapsed: boolean

  dashboardLoading: boolean
  dashboardError: string | null
  profileLoading: boolean
  profileError: string | null

  fetchEmployeeDashboard: () => Promise<void>
  fetchEmployeeProfile: () => Promise<void>
  fetchAttendanceHistory: (startDate: string, endDate: string) => Promise<void>
  fetchLeaveRequests: () => Promise<void>
  submitLeaveRequest: (payload: {
    start_date: string
    end_date: string
    reason: string
  }) => Promise<void>
  setEmployee: (employee: EmployeeProfile) => void
  addAttendanceRecord: (record: AttendanceRecord) => void
  addLeaveRequest: (request: LeaveRequest) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

const normaliseStatus = (value: unknown): AttendanceStatus => {
  const status = String(value ?? "").toLowerCase()
  switch (status) {
    case "present":
    case "on_time":
    case "clocked_in":
      return "present"
    case "late":
    case "late_arrival":
      return "late"
    case "leave":
    case "on_leave":
      return "leave"
    default:
      return "absent"
  }
}

const safeString = (value: unknown): string => {
  return value === undefined || value === null ? "" : String(value)
}

const normaliseDate = (value: unknown): string => {
  if (!value) return ""
  const date = new Date(value as string)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toISOString().split("T")[0] ?? ""
}

const extractArray = (value: unknown, depth = 0): unknown[] => {
  if (Array.isArray(value)) return value
  if (!value || typeof value !== "object" || depth >= 3) return []

  const record = value as Record<string, unknown>
  const keysToInspect = [
    "data",
    "items",
    "results",
    "list",
    "rows",
    "records",
    "requests",
    "leave_requests",
    "leaveRequests",
    "pending_leave_requests",
  ]

  for (const key of keysToInspect) {
    const nested = record[key]
    if (nested === undefined) continue

    const extracted = extractArray(nested, depth + 1)
    if (extracted.length > 0) {
      return extracted
    }
  }

  return []
}

const safeMessage = (error: unknown): string => {
  if (typeof error === "string") return error
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message ?? "Request failed")
  }
  return "Request failed"
}

const isNetworkError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false
  }

  const maybe = error as { code?: unknown; message?: unknown }
  const code = typeof maybe.code === "string" ? maybe.code.toLowerCase() : ""
  if (code === "err_network") {
    return true
  }

  const message = typeof maybe.message === "string" ? maybe.message.toLowerCase() : ""
  return message.includes("network") && message.includes("error")
}

export const useEmployeeModuleStore = create<EmployeeState>()(
  persist(
    (set) => ({
      employee: null,
      attendanceSummary: null,
      attendanceRecords: [],
      attendanceHistory: [],
      attendanceHistoryFilters: null,
      attendanceHistoryLoading: false,
      attendanceHistoryError: null,
      leaveRequests: [],
      leaveRequestsLoading: false,
      leaveRequestsError: null,
      leaveRequestSubmitting: false,
      sidebarCollapsed: false,
      dashboardLoading: false,
      dashboardError: null,
      profileLoading: false,
      profileError: null,

      fetchEmployeeDashboard: async () => {
        set({ dashboardLoading: true, dashboardError: null })
        try {
          const response = await api.get("/employee/dashboard")
          const payload = response.data?.data ?? response.data ?? {}
          const payloadRecord =
            !Array.isArray(payload) && payload && typeof payload === "object"
              ? (payload as Record<string, unknown>)
              : null

          const summaryRaw = payload.attendance_summary ?? {}
          const attendanceSummary: AttendanceSummary | null =
            typeof summaryRaw === "object" && summaryRaw
              ? {
                  attendancePercentage: Number(
                    summaryRaw.attendance_percentage ?? 0,
                  ),
                  daysPresentThisMonth: Number(
                    summaryRaw.days_present_this_month ?? 0,
                  ),
                  totalWorkingDays: Number(
                    summaryRaw.total_working_days ?? 0,
                  ),
                }
              : null

          const recentAttendanceRaw: unknown[] = Array.isArray(
            payload.recent_attendance,
          )
            ? payload.recent_attendance
            : []

          const attendanceRecords: AttendanceRecord[] = recentAttendanceRaw.map(
            (item, index) => {
              const record = item as Record<string, unknown>
              const idValue =
                record.id ??
                record.record_id ??
                record.attendance_id ??
                `${record.date ?? record.attendance_date ?? index}`

              const dateValue =
                record.date ??
                record.attendance_date ??
                record.clock_in_date ??
                record.created_at

              return {
                id: safeString(idValue ?? `${index}`),
                date: normaliseDate(dateValue),
                clockIn: safeString(
                  record.clock_in ??
                    record.clockIn ??
                    record.check_in ??
                    record.clock_in_time ??
                    "",
                ),
                clockOut: safeString(
                  record.clock_out ??
                    record.clockOut ??
                    record.check_out ??
                    record.clock_out_time ??
                    "",
                ),
                status: normaliseStatus(
                  record.status ?? record.attendance_status ?? "",
                ),
                notes: safeString(record.notes ?? record.remark ?? ""),
              }
            },
          )

          const pendingLeaveSource =
            payloadRecord?.["pending_leave_requests"] ??
            payloadRecord?.["leave_requests"] ??
            payloadRecord?.["leaveRequests"] ??
            []
          const pendingLeaveRaw: unknown[] = extractArray(pendingLeaveSource)

          const pendingLeaveRequests: LeaveRequest[] = pendingLeaveRaw.map(
            (item, index) => {
              const request = item as Record<string, unknown>
              const idValue =
                request.id ??
                request.request_id ??
                `${request.start_date ?? index}`

              const statusRaw = safeString(
                request.status ?? request.request_status ?? "pending",
              ).toLowerCase()

              let status: LeaveRequest["status"] = "pending"
              if (statusRaw.includes("reject")) {
                status = "rejected"
              } else if (statusRaw.includes("approve")) {
                status = "approved"
              } else if (statusRaw.includes("pending")) {
                status = "pending"
              }

              return {
                id: safeString(idValue ?? `${index}`),
                start_date: safeString(
                  request.start_date ?? request.startDate ?? "",
                ),
                end_date: safeString(request.end_date ?? request.endDate ?? ""),
                reason: safeString(
                  request.reason ?? request.description ?? "",
                ),
                status,
                submittedAt: safeString(
                  request.submitted_at ??
                    request.created_at ??
                    new Date().toISOString(),
                ),
              }
            },
          )

          set({
            attendanceSummary,
            attendanceRecords,
            leaveRequests: pendingLeaveRequests,
            dashboardLoading: false,
            dashboardError: null,
          })
        } catch (error) {
          set({
            dashboardLoading: false,
            dashboardError: safeMessage(
              (error as any)?.response?.data?.message ?? error,
            ),
          })
        }
      },

      fetchEmployeeProfile: async () => {
        set({ profileLoading: true, profileError: null })
        try {
          const response = await api.get("/employee/profile")
          const payload = response.data?.data ?? response.data ?? {}

          const supervisor = payload.supervisor ?? payload.supervisor_info ?? {}

          const firstName = safeString(
            payload.first_name ?? payload.firstName ?? "",
          )
          const lastName = safeString(
            payload.last_name ?? payload.lastName ?? "",
          )
          const fullName =
            safeString(payload.full_name ?? payload.fullName ?? "").trim() ||
            [firstName, lastName].filter(Boolean).join(" ").trim()

          let supervisorName = safeString(
            supervisor?.full_name ??
              supervisor?.name ??
              supervisor?.supervisor_name ??
              "",
          )
          let supervisorPhone = safeString(
            supervisor?.phone_number ??
              supervisor?.phone ??
              supervisor?.supervisor_phone ??
              "",
          )

          if (!supervisorName || !supervisorPhone) {
            try {
              const debugResponse = await api.get("/debug/db-info")
              const debugPayload = debugResponse.data?.data ?? debugResponse.data ?? []

              if (Array.isArray(debugPayload)) {
                for (const record of debugPayload) {
                  if (!record || typeof record !== "object") continue
                  const entry = record as Record<string, unknown>

                  const employeesRaw = Array.isArray(entry.employees)
                    ? entry.employees
                    : Array.isArray((entry as any)?.employees?.items)
                      ? (entry as any).employees.items
                      : []
                  const supervisorsRaw = Array.isArray(entry.supervisors)
                    ? entry.supervisors
                    : Array.isArray((entry as any)?.supervisors?.items)
                      ? (entry as any).supervisors.items
                      : []

                  let matchedSupervisorId: string | null = null

                  for (const emp of employeesRaw) {
                    if (!emp || typeof emp !== "object") continue
                    const candidate = emp as Record<string, unknown>
                    const idMatch =
                      safeString(candidate.id) &&
                      safeString(candidate.id) === safeString(payload.id)
                    const emailMatch =
                      safeString(candidate.email).toLowerCase() &&
                      safeString(candidate.email).toLowerCase() ===
                        safeString(payload.email).toLowerCase()

                    if (idMatch || emailMatch) {
                      matchedSupervisorId = safeString(
                        candidate.supervisor_id ?? candidate.supervisorId ?? "",
                      )
                      break
                    }
                  }

                  if (!matchedSupervisorId) {
                    continue
                  }

                  for (const sup of supervisorsRaw) {
                    if (!sup || typeof sup !== "object") continue
                    const supervisorCandidate = sup as Record<string, unknown>
                    const supervisorId = safeString(
                      supervisorCandidate.id ??
                        supervisorCandidate.supervisor_id ??
                        supervisorCandidate.uuid ??
                        supervisorCandidate.user_id ??
                        "",
                    )

                    if (supervisorId && supervisorId === matchedSupervisorId) {
                      supervisorName =
                        supervisorName ||
                        safeString(
                          supervisorCandidate.full_name ??
                            supervisorCandidate.name ??
                            supervisorCandidate.supervisor_name ??
                            "",
                        )
                      supervisorPhone =
                        supervisorPhone ||
                        safeString(
                          supervisorCandidate.phone_number ??
                            supervisorCandidate.phone ??
                            supervisorCandidate.supervisor_phone ??
                            "",
                        )
                      break
                    }
                  }

                  if (supervisorName || supervisorPhone) break
                }
              }
            } catch (debugError) {
              console.warn("Unable to enrich supervisor info from /debug/db-info", debugError)
            }
          }

          const employeeProfile: EmployeeProfile = {
            id: safeString(payload.id ?? ""),
            firstName,
            lastName,
            fullName,
            email: safeString(payload.email ?? ""),
            phoneNumber: safeString(
              payload.phone_number ?? payload.phone ?? "",
            ),
            address: safeString(payload.address ?? ""),
            role: safeString(payload.role ?? ""),
            organizationId: safeString(payload.organization_id ?? ""),
            isActive: Boolean(
              payload.is_active ?? payload.active ?? payload.status ?? true,
            ),
            emailVerified: Boolean(
              payload.email_verified ?? payload.is_email_verified ?? false,
            ),
            emergencyContactName: safeString(
              payload.emergency_contact_name ?? "",
            ),
            emergencyContactPhone: safeString(
              payload.emergency_contact_phone ?? "",
            ),
            nin: safeString(payload.nin ?? ""),
            createdAt: safeString(payload.created_at ?? ""),
            supervisorName,
            supervisorPhone,
          }

          set({
            employee: employeeProfile,
            profileLoading: false,
            profileError: null,
          })
        } catch (error) {
          set({
            profileLoading: false,
            profileError: safeMessage(
              (error as any)?.response?.data?.message ?? error,
            ),
          })
        }
      },

      fetchAttendanceHistory: async (startDate, endDate) => {
        set({
          attendanceHistoryLoading: true,
          attendanceHistoryError: null,
          attendanceHistoryFilters: { startDate, endDate },
        })
        try {
          const response = await api.get("/employee/attendance", {
            params: {
              start_date: startDate,
              end_date: endDate,
            },
          })

          const payload = response.data?.data ?? response.data ?? []
          const recordsRaw: unknown[] = Array.isArray(payload)
            ? payload
            : Array.isArray(payload.records)
              ? payload.records
              : []

          const history: AttendanceRecord[] = recordsRaw.map((item, index) => {
            const record = item as Record<string, unknown>
            const idValue =
              record.id ??
              record.attendance_id ??
              record.record_id ??
              `${record.date ?? record.attendance_date ?? index}`

            const dateValue =
              record.date ??
              record.attendance_date ??
              record.clock_in_date ??
              record.created_at

            return {
              id: safeString(idValue ?? `${index}`),
              date: normaliseDate(dateValue),
              clockIn: safeString(
                record.clock_in ??
                  record.clockIn ??
                  record.check_in ??
                  record.clock_in_time ??
                  record.first_clock_in ??
                  "",
              ),
              clockOut: safeString(
                record.clock_out ??
                  record.clockOut ??
                  record.check_out ??
                  record.clock_out_time ??
                  record.last_clock_out ??
                  "",
              ),
              status: normaliseStatus(
                record.status ?? record.attendance_status ?? "",
              ),
              notes: safeString(record.notes ?? record.remark ?? record.note ?? ""),
            }
          })

          set({
            attendanceHistory: history,
            attendanceHistoryLoading: false,
            attendanceHistoryError: null,
          })
        } catch (error) {
          set({
            attendanceHistoryLoading: false,
            attendanceHistoryError: safeMessage(
              (error as any)?.response?.data?.message ?? error,
            ),
          })
        }
      },

      fetchLeaveRequests: async () => {
        set({ leaveRequestsLoading: true, leaveRequestsError: null })
        try {
          const response = await api.get("/employee/leave-requests")
          const payload = response.data?.data ?? response.data ?? []
          const requestsRaw: unknown[] = extractArray(payload)

          const requests: LeaveRequest[] = requestsRaw.map((item, index) => {
            const request = item as Record<string, unknown>
            const idValue =
              request.id ??
              request.request_id ??
              `${request.start_date ?? request.startDate ?? index}`

            const statusRaw = safeString(
              request.status ?? request.request_status ?? "pending",
            ).toLowerCase()

            let status: LeaveRequest["status"] = "pending"
            if (statusRaw.includes("reject")) {
              status = "rejected"
            } else if (statusRaw.includes("approve")) {
              status = "approved"
            }

            return {
              id: safeString(idValue ?? `${index}`),
              start_date: safeString(
                request.start_date ?? request.startDate ?? "",
              ),
              end_date: safeString(request.end_date ?? request.endDate ?? ""),
              reason: safeString(
                request.reason ?? request.description ?? "",
              ),
              status,
              submittedAt: safeString(
                request.submitted_at ??
                  request.created_at ??
                  new Date().toISOString(),
              ),
            }
          })

          set({
            leaveRequests: requests,
            leaveRequestsLoading: false,
            leaveRequestsError: null,
          })
        } catch (error) {
          set({
            leaveRequestsLoading: false,
            leaveRequestsError: safeMessage(
              (error as any)?.response?.data?.message ?? error,
            ),
          })
        }
      },

      submitLeaveRequest: async (payload) => {
        set({ leaveRequestSubmitting: true, leaveRequestsError: null })
        try {
          const response = await api.post("/employee/leave-requests", payload)
          const data = response.data?.data ?? response.data ?? {}

          const maybeArray = Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : null

          if (Array.isArray(maybeArray)) {
            const requests = maybeArray.map((item, index) => {
              const request = item as Record<string, unknown>
              const idValue =
                request.id ??
                request.request_id ??
                `${request.start_date ?? request.startDate ?? index}`

              const statusRaw = safeString(
                request.status ?? request.request_status ?? "pending",
              ).toLowerCase()

              let status: LeaveRequest["status"] = "pending"
              if (statusRaw.includes("reject")) {
                status = "rejected"
              } else if (statusRaw.includes("approve")) {
                status = "approved"
              }

              return {
                id: safeString(idValue ?? `${index}`),
                start_date: safeString(
                  request.start_date ?? request.startDate ?? payload.start_date,
                ),
                end_date: safeString(
                  request.end_date ?? request.endDate ?? payload.end_date,
                ),
                reason: safeString(
                  request.reason ?? request.description ?? payload.reason,
                ),
                status,
                submittedAt: safeString(
                  request.submitted_at ??
                    request.created_at ??
                    new Date().toISOString(),
                ),
              }
            })

            set({
              leaveRequests: requests,
              leaveRequestSubmitting: false,
            })
          } else {
            const request = data as Record<string, unknown>
            const statusRaw = safeString(
              request.status ?? request.request_status ?? "pending",
            ).toLowerCase()

            const status: LeaveRequest["status"] = statusRaw.includes("reject")
              ? "rejected"
              : statusRaw.includes("approve")
                ? "approved"
                : "pending"

            const newRequest: LeaveRequest = {
              id: safeString(request.id ?? request.request_id ?? Date.now().toString()),
              start_date: safeString(request.start_date ?? request.startDate ?? payload.start_date),
              end_date: safeString(request.end_date ?? request.endDate ?? payload.end_date),
              reason: safeString(request.reason ?? request.description ?? payload.reason),
              status,
              submittedAt: safeString(request.submitted_at ?? request.created_at ?? new Date().toISOString()),
            }

            set((state) => ({
              leaveRequests: [newRequest, ...state.leaveRequests],
              leaveRequestSubmitting: false,
            }))
          }
        } catch (error) {
          const message = isNetworkError(error)
            ? "Network error: Unable to reach the server. Please check your connection and try again."
            : safeMessage((error as any)?.response?.data?.message ?? error)

          set({
            leaveRequestSubmitting: false,
            leaveRequestsError: message,
          })

          throw new Error(message)
        }
      },

      setEmployee: (employee) => set({ employee }),

      addAttendanceRecord: (record) =>
        set((state) => ({
          attendanceRecords: [record, ...state.attendanceRecords],
        })),

      addLeaveRequest: (request) =>
        set((state) => ({
          leaveRequests: [request, ...state.leaveRequests],
        })),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: "employee-storage",
      partialize: (state) => ({
        employee: state.employee,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
)

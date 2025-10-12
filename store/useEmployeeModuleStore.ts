import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  department: string
  position: string
  avatar?: string
}

export interface AttendanceRecord {
  id: string
  date: string
  clockIn?: string
  clockOut?: string
  status: "present" | "absent" | "late" | "leave"
  notes?: string
}

export interface LeaveRequest {
  id: string
  reason: string
  expectedLeaveTime: string
  details?: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

interface EmployeeState {
  employee: Employee | null
  attendanceRecords: AttendanceRecord[]
  leaveRequests: LeaveRequest[]
  sidebarCollapsed: boolean

  // Actions
  setEmployee: (employee: Employee) => void
  addAttendanceRecord: (record: AttendanceRecord) => void
  addLeaveRequest: (request: LeaveRequest) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useEmployeeModuleStore = create<EmployeeState>()(
  persist(
    (set) => ({
      employee: {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@construction.com",
        department: "Construction",
        position: "Site Worker",
        avatar: "/construction-worker-avatar.png",
      },
      attendanceRecords: [
        {
          id: "1",
          date: "2024-01-15",
          clockIn: "08:00",
          clockOut: "17:00",
          status: "present",
          notes: "Regular shift",
        },
        {
          id: "2",
          date: "2024-01-14",
          clockIn: "08:15",
          clockOut: "17:00",
          status: "late",
          notes: "Traffic delay",
        },
        {
          id: "3",
          date: "2024-01-13",
          status: "absent",
          notes: "Sick leave",
        },
      ],
      leaveRequests: [
        {
          id: "1",
          reason: "Medical appointment",
          expectedLeaveTime: "2024-01-20T14:00",
          details: "Doctor appointment",
          status: "approved",
          submittedAt: "2024-01-18T10:00",
        },
      ],
      sidebarCollapsed: false,

      setEmployee: (employee) => set({ employee }),
      addAttendanceRecord: (record) =>
        set((state) => ({
          attendanceRecords: [record, ...state.attendanceRecords],
        })),
      addLeaveRequest: (request) =>
        set((state) => ({
          leaveRequests: [request, ...state.leaveRequests],
        })),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
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

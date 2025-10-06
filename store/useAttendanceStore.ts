import { create } from "zustand"

interface Employee {
  id: string
  name: string
  department: string
  status: "in" | "out" | "break"
  lastAction: string // ISO timestamp
  fingerprintEnrolled: boolean
}

interface AttendanceRecord {
  id: string
  employeeId: string
  action: "clock-in" | "clock-out" | "break-start" | "break-end"
  timestamp: string // ISO timestamp
  location?: string
}

interface AttendanceStore {
  employees: Employee[]
  attendanceRecords: AttendanceRecord[]
  isKioskMode: boolean

  // Actions
  addEmployee: (employee: Omit<Employee, "id">) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  recordAttendance: (record: Omit<AttendanceRecord, "id">) => void
  setKioskMode: (enabled: boolean) => void
  getEmployeeStatus: (employeeId: string) => Employee | undefined
  getTodayAttendance: () => AttendanceRecord[]
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  // Use static ISO timestamps to avoid generating different values on server vs client during module initialization
  employees: [
    {
      id: "1",
      name: "John Smith",
      department: "Construction",
      status: "out",
      lastAction: "2024-01-01T08:00:00.000Z",
      fingerprintEnrolled: true,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      department: "Safety",
      status: "in",
      lastAction: "2024-01-01T09:00:00.000Z",
      fingerprintEnrolled: true,
    },
    {
      id: "3",
      name: "Mike Wilson",
      department: "Equipment",
      status: "break",
      lastAction: "2024-01-01T09:30:00.000Z",
      fingerprintEnrolled: false,
    },
  ],
  attendanceRecords: [],
  isKioskMode: false,

  addEmployee: (employee) =>
    set((state) => ({
      employees: [...state.employees, { ...employee, id: Date.now().toString() }],
    })),

  updateEmployee: (id, updates) =>
    set((state) => ({
      employees: state.employees.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp)),
    })),

  deleteEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((emp) => emp.id !== id),
    })),

  recordAttendance: (record) =>
    set((state) => {
      const newRecord = { ...record, id: Date.now().toString() }

      // Update employee status based on action
      const updatedEmployees = state.employees.map((emp) => {
        if (emp.id === record.employeeId) {
          let newStatus: "in" | "out" | "break" = emp.status

          switch (record.action) {
            case "clock-in":
              newStatus = "in"
              break
            case "clock-out":
              newStatus = "out"
              break
            case "break-start":
              newStatus = "break"
              break
            case "break-end":
              newStatus = "in"
              break
          }

          return { ...emp, status: newStatus, lastAction: record.timestamp }
        }
        return emp
      })

      return {
        attendanceRecords: [...state.attendanceRecords, newRecord],
        employees: updatedEmployees,
      }
    }),

  setKioskMode: (enabled) => set({ isKioskMode: enabled }),

  getEmployeeStatus: (employeeId) => {
    const { employees } = get()
    return employees.find((emp) => emp.id === employeeId)
  },

  getTodayAttendance: () => {
    const { attendanceRecords } = get()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return attendanceRecords.filter((record) => {
      const recordDate = new Date(record.timestamp)
      recordDate.setHours(0, 0, 0, 0)
      return recordDate.getTime() === today.getTime()
    })
  },
}))

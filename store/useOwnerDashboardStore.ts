"use client"

import { create } from "zustand"

export interface SummaryStats {
  totalEmployees: number
  activeProjects: number
  attendanceToday: number // percentage 0-100
  activeSupervisors: number
}

export interface TrendPoint {
  date: string
  attendance: number
}

export interface ProjectItem {
  id: string
  name: string
  supervisor: string
  progress: number // 0-100
  updatedAt: string
}

export interface ActivityItem {
  id: string
  type: "attendance" | "employee" | "project"
  message: string
  timestamp: string
}

interface OwnerDashboardState {
  loading: boolean
  summary: SummaryStats | null
  trends: TrendPoint[]
  projects: ProjectItem[]
  activity: ActivityItem[]
  fetchAll: () => Promise<void>
}

export const useOwnerDashboardStore = create<OwnerDashboardState>((set) => ({
  loading: false,
  summary: null,
  trends: [],
  projects: [],
  activity: [],

  fetchAll: async () => {
    set({ loading: true })
    try {
      // Simulate network calls; replace with real fetch('/api/owners/...') later
      await new Promise((r) => setTimeout(r, 400))
      const now = new Date()
      const fmt = (d: Date) => d.toISOString().slice(0, 10)
      const days = Array.from({ length: 14 }).map((_, i) => {
        const d = new Date(now)
        d.setDate(now.getDate() - (13 - i))
        return { date: fmt(d), attendance: Math.round(70 + Math.random() * 25) }
      })

      set({
        summary: {
          totalEmployees: 248,
          activeProjects: 12,
          attendanceToday: days[days.length - 1].attendance,
          activeSupervisors: 9,
        },
        trends: days,
        projects: [
          { id: "p1", name: "Site A - Downtown Tower", supervisor: "Ada I.", progress: 64, updatedAt: fmt(now) },
          { id: "p2", name: "Bridge Expansion East", supervisor: "Bola K.", progress: 81, updatedAt: fmt(now) },
          { id: "p3", name: "Airport Hangar", supervisor: "Chinedu U.", progress: 37, updatedAt: fmt(now) },
        ],
        activity: [
          { id: "a1", type: "attendance", message: "187 employees clocked in before 8:00 AM", timestamp: new Date().toISOString() },
          { id: "a2", type: "employee", message: "New employee added: Jane Doe (Electrician)", timestamp: new Date().toISOString() },
          { id: "a3", type: "project", message: "Bridge Expansion East progress updated to 81%", timestamp: new Date().toISOString() },
        ],
        loading: false,
      })
    } catch (e) {
      set({ loading: false })
    }
  },
}))


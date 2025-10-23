"use client"

import { useEffect } from "react"
import { HeroSection } from "./components/hero-section"
import { StatsCards } from "./components/stats-cards"
import { AttendanceChart } from "./components/attendance-chart"
import { PresencePieChart } from "./components/presence-pie-chart"
import { RecentActivity } from "./components/recent-activity"
import { useEmployeeModuleStore } from "@/store/useEmployeeModuleStore"

export default function EmployeeDashBoard() {
  const fetchEmployeeDashboard = useEmployeeModuleStore((state) => state.fetchEmployeeDashboard)
  const fetchEmployeeProfile = useEmployeeModuleStore((state) => state.fetchEmployeeProfile)
  const fetchLeaveRequests = useEmployeeModuleStore((state) => state.fetchLeaveRequests)

  useEffect(() => {
    void fetchEmployeeDashboard()
  }, [fetchEmployeeDashboard])

  useEffect(() => {
    void fetchEmployeeProfile()
  }, [fetchEmployeeProfile])

  useEffect(() => {
    void fetchLeaveRequests()
  }, [fetchLeaveRequests])

  return (
    <div className="space-y-6">
      <HeroSection />
      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AttendanceChart />
        <PresencePieChart />
      </div>

      <RecentActivity />
    </div>
  )
}

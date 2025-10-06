import { HeroSection } from "./components/hero-section";
import { StatsCards } from "./components/stats-cards";
import { AttendanceChart } from "./components/attendance-chart";
import { PresencePieChart } from "./components/presence-pie-chart";
import { RecentActivity } from "./components/recent-activity";

export default function EmployeeDashBoard() {
  return (
    <div className="space-y-6">
      <HeroSection />
      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-3">
        <AttendanceChart />
        <PresencePieChart />
      </div>

      <RecentActivity />
    </div>
  );
}

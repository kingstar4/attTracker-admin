import {
  LayoutDashboard,
  ScanFace,
  Fingerprint,
  Clock,
  Users,
  UsersRound,
  Settings,
  Building2,
  Mail,
} from "lucide-react"

export const navigation = {
  owner: [
    { icon: LayoutDashboard, label: "Dashboard", to: "/owner" },
    { icon: Building2, label: "Projects / Sites", to: "/owner/projects" },
    { icon: Users, label: "Supervisors", to: "/owner/supervisors" },
    { icon: UsersRound, label: "Employees", to: "/owner/employees" },
    { icon: Clock, label: "Attendance Logs", to: "/owner/attendance" },
    { icon: Mail, label: "Invitations", to: "/owner/invitations" },
    { icon: Settings, label: "Settings", to: "/owner/settings" },
  ],

  supervisor: [
    { icon: LayoutDashboard, label: "Dashboard", to: "/supervisor" },
    { icon: ScanFace, label: "Kiosk (Clock In/Out)", to: "/supervisor/kiosk" },
    { icon: Fingerprint, label: "Enrollment", to: "/supervisor/enrollment" },
    { icon: Users, label: "Employees", to: "/supervisor/employees" },
    { icon: Settings, label: "Settings", to: "/supervisor/settings" },
  ],

  employee: [
    { icon: LayoutDashboard, label: "Dashboard", to: "/employee" },
    { icon: Clock, label: "Attendance", to: "/employee/attendance" },
    { icon: Settings, label: "Settings", to: "/employee/settings" },
  ],
}

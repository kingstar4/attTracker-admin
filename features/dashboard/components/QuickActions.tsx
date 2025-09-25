"use client"

import { Button } from "@/components/ui/button"
import { Plus, Download, Settings, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

export function QuickActions() {
  const router = useRouter()

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={() => router.push("/employees")} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Employee
      </Button>
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm">
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={() => router.push("/settings")}>
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  )
}

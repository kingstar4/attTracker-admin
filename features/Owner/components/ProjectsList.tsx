"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export interface ProjectItem {
  id: string
  name: string
  supervisor: string
  progress: number
  updatedAt: string
}

export function ProjectsList({ projects }: { projects: ProjectItem[] }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Active Projects</h3>
        <p className="text-xs text-muted-foreground">Current sites and progress</p>
      </div>
      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p.id} className="grid gap-2 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">Supervisor: {p.supervisor}</p>
              </div>
              <span className="text-sm font-semibold">{p.progress}%</span>
            </div>
            <Progress value={p.progress} />
            <p className="text-xs text-muted-foreground">Updated {new Date(p.updatedAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}


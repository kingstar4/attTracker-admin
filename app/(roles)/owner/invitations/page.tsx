"use client"

import { useEffect, useState } from "react"
import { LayoutList } from "lucide-react"
import { useInvitationStore } from "@/store/useInvitationStore"
import { InvitationsList } from "@/features/Owner/invitations/InvitationsList"
import { InviteUserModal } from "@/features/Owner/components/InviteUserModal"
import { useOwnerDashboardStore } from "@/store/useOwnerDashboardStore"
import { Skeleton } from "@/components/ui/skeleton"

export default function OwnerInvitationsPage() {
  const { fetchInvites, loading } = useInvitationStore()
  const { projects, fetchAll } = useOwnerDashboardStore()
  const [projectsLoaded, setProjectsLoaded] = useState(false)

  useEffect(() => {
    fetchInvites()
  }, [fetchInvites])

  useEffect(() => {
    if (!projectsLoaded) {
      fetchAll().finally(() => setProjectsLoaded(true))
    }
  }, [projectsLoaded, fetchAll])

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutList className="h-5 w-5" />
          <h1 className="text-xl font-semibold">Invitations</h1>
        </div>
        {projectsLoaded ? <InviteUserModal projects={projects} /> : <Skeleton className="h-9 w-36" />}
      </div>
      <InvitationsList />
    </div>
  )
}


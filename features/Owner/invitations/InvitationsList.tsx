"use client"

import { Invitation, useInvitationStore } from "@/store/useInvitationStore"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

const statusColor: Record<Invitation["status"], string> = {
  pending: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  accepted: "bg-green-500/15 text-green-600 dark:text-green-400",
  expired: "bg-red-500/15 text-red-600 dark:text-red-400",
}

export function InvitationsList() {
  const { invites, resendInvite, revokeInvite, loading } = useInvitationStore()
  const { toast } = useToast()

  const handleResend = async (id: string) => {
    try {
      await resendInvite(id)
      toast({ title: "Invitation resent" })
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message })
    }
  }

  const handleRevoke = async (id: string) => {
    try {
      await revokeInvite(id)
      toast({ title: "Invitation revoked" })
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message })
    }
  }

  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Invitations</h3>
        <p className="text-xs text-muted-foreground">Pending and accepted invitations</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Sent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>{[inv.firstName, inv.lastName].filter(Boolean).join(" ") || "—"}</TableCell>
                <TableCell>{inv.email}</TableCell>
                <TableCell className="capitalize">{inv.role}</TableCell>
                <TableCell>{inv.projectName || "—"}</TableCell>
                <TableCell>
                  <Badge className={statusColor[inv.status]} variant="secondary">
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(inv.sentAt).toLocaleString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" disabled={loading || inv.status !== "pending"} onClick={() => handleResend(inv.id)}>
                    Resend
                  </Button>
                  <Button size="sm" variant="destructive" disabled={loading || inv.status !== "pending"} onClick={() => handleRevoke(inv.id)}>
                    Revoke
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}


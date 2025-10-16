"use client";

import { useEffect } from "react";
import { LayoutList } from "lucide-react";
import { useInvitationStore } from "@/store/useInvitationStore";
import { InvitationsList } from "@/features/Owner/invitations/InvitationsList";
import { InviteUserModal } from "@/features/Owner/components/InviteUserModal";

export default function OwnerInvitationsPage() {
  const { fetchInvites } = useInvitationStore();

  useEffect(() => {
    void fetchInvites("supervisor").catch(() => undefined);
  }, [fetchInvites]);

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutList className="h-5 w-5" />
          <h1 className="text-xl font-semibold">Invitations</h1>
        </div>
        <InviteUserModal />
      </div>
      <InvitationsList />
    </div>
  );
}

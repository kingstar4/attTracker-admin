"use client"

import { create } from "zustand"

export type InvitationStatus = "pending" | "accepted" | "expired"
export type InvitationRole = "supervisor" | "employee"

export interface Invitation {
  id: string
  first_name?: string
  last_name?: string
  email: string
  phone_number?: string
  address?: string
  role: InvitationRole
  projectName?: string | null
  sentAt: string
  status: InvitationStatus
}

interface InvitationState {
  invites: Invitation[]
  loading: boolean
  error: string | null
  fetchInvites: () => Promise<void>
  sendInvite: (payload: {
    email: string
    first_name: string
    last_name: string
    phone_number: string
    address: string
  }) => Promise<void>
  revokeInvite: (id: string) => Promise<void>
  resendInvite: (id: string) => Promise<void>
}

export const useInvitationStore = create<InvitationState>((set, get) => ({
  invites: [],
  loading: false,
  error: null,

  fetchInvites: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch("/api/invitations")
      if (!res.ok) throw new Error("Failed to fetch invitations")
      const data: { invitations: Invitation[] } = await res.json()
      set({ invites: data.invitations, loading: false })
    } catch (e) {
      set({ error: (e as Error).message, loading: false })
    }
  },

  sendInvite: async (payload) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch("/api/invitations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payload.email,
          first_name: payload.first_name,
          last_name: payload.last_name,
          phone_number: payload.phone_number,
          address: payload.address,
        }),
      })
      if (!res.ok) throw new Error("Failed to send invitation")
      // Optionally parse response for token; refresh list instead
      await get().fetchInvites()
    } catch (e) {
      set({ error: (e as Error).message })
      throw e
    } finally {
      set({ loading: false })
    }
  },

  revokeInvite: async (id) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`/api/invitations/revoke/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to revoke invitation")
      await get().fetchInvites()
    } catch (e) {
      set({ error: (e as Error).message })
      throw e
    } finally {
      set({ loading: false })
    }
  },

  resendInvite: async (id) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`/api/invitations/resend/${id}`, { method: "POST" })
      if (!res.ok) throw new Error("Failed to resend invitation")
      // Keep list; server may update sentAt; refresh to reflect
      await get().fetchInvites()
    } catch (e) {
      set({ error: (e as Error).message })
      throw e
    } finally {
      set({ loading: false })
    }
  },
}))


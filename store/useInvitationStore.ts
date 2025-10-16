"use client"

import { create } from "zustand"
import api from "@/lib/api"

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

export interface InvitePayload {
  email: string
  first_name: string
  last_name: string
  phone_number: string
  address: string
  nin?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
}

interface InvitationState {
  invites: Invitation[]
  loading: boolean
  error: string | null
  fetchInvites: (role?: InvitationRole) => Promise<void>
  sendInvite: (role: InvitationRole, payload: InvitePayload) => Promise<void>
  revokeInvite: (id: string, role?: InvitationRole) => Promise<void>
  resendInvite: (id: string, role?: InvitationRole) => Promise<void>
}

type RoleEndpointConfig = {
  fetch?: string
  create: string | string[]
  revoke: (id: string) => string
  resend: (id: string) => string
}

const endpointByRole: Record<InvitationRole, RoleEndpointConfig> = {
  supervisor: {
    fetch: undefined,
    create: "/owner/supervisors",
    revoke: (id) => `/owner/supervisors/${id}`,
    resend: (id) => `/owner/supervisors/${id}/resend`,
  },
  employee: {
    fetch: "/supervisor/employees",
    create: "/supervisor/employees",
    revoke: (id) => `/supervisor/employees/${id}`,
    resend: (id) => `/supervisor/employees/${id}/resend`,
  },
}

const extractInvites = (data: any): Invitation[] => {
  if (!data) return []
  if (Array.isArray(data)) return data as Invitation[]
  if (Array.isArray(data.invitations)) return data.invitations as Invitation[]
  if (Array.isArray(data.data)) return data.data as Invitation[]
  return []
}

export const useInvitationStore = create<InvitationState>((set, get) => ({
  invites: [],
  loading: false,
  error: null,

  fetchInvites: async (role = "supervisor") => {
    set({ loading: true, error: null })
    try {
      const fetchEndpoint = endpointByRole[role].fetch
      if (!fetchEndpoint) {
        set({ invites: [], loading: false })
        return
      }

      const response = await api.get(fetchEndpoint)
      const payload = response.data?.data ?? response.data
      set({ invites: extractInvites(payload), loading: false })
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Failed to fetch invitations"
      set({ error: message, loading: false })
      throw new Error(message)
    }
  },

  sendInvite: async (role, payload) => {
    set({ loading: true, error: null })
    try {
      const endpoints = Array.isArray(endpointByRole[role].create)
        ? endpointByRole[role].create
        : [endpointByRole[role].create]

      let lastError: any = null

      for (const endpoint of endpoints) {
        try {
          await api.post(endpoint, payload)
          lastError = null
          break
        } catch (error: any) {
          lastError = error
          const status = error?.response?.status
          if (status !== 404 && status !== 405) {
            throw error
          }
        }
      }

      if (lastError) {
        throw lastError
      }

      await get().fetchInvites(role)
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Failed to send invitation"
      set({ error: message })
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  },

  revokeInvite: async (id, role = "supervisor") => {
    set({ loading: true, error: null })
    try {
      await api.delete(endpointByRole[role].revoke(id))
      await get().fetchInvites(role)
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Failed to revoke invitation"
      set({ error: message })
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  },

  resendInvite: async (id, role = "supervisor") => {
    set({ loading: true, error: null })
    try {
      await api.post(endpointByRole[role].resend(id))
      await get().fetchInvites(role)
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Failed to resend invitation"
      set({ error: message })
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  },
}))

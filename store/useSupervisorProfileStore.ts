"use client"

import { create } from "zustand"
import api from "@/lib/api"

export interface SupervisorProfileDetails {
  first_name: string
  last_name: string
  phone_number: string
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
}

export interface SupervisorAccountSummary {
  id: string
  email: string
  role: string
  full_name: string
  nin?: string
  team_summary?: {
    pending_leave_requests: number
    team_size: number
  }
}

export interface SupervisorProfileUpdatePayload {
  phone_number?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  address?: string
}

interface SupervisorProfileState {
  loading: boolean
  updating: boolean
  error: string | null
  updateError: string | null
  profile: SupervisorProfileDetails | null
  account: SupervisorAccountSummary | null
  lastFetchedAt: string | null
  lastSavedAt: string | null
  fetchProfile: () => Promise<void>
  updateProfile: (payload: SupervisorProfileUpdatePayload) => Promise<void>
}

const defaultProfile: SupervisorProfileDetails = {
  first_name: "",
  last_name: "",
  phone_number: "",
  address: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
}

const safeString = (value: unknown, fallback = ""): string => {
  if (value === undefined || value === null) return fallback
  if (typeof value === "string") return value
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value)
  }
  return fallback
}

const toOptionalString = (value: unknown): string | undefined => {
  if (value === undefined) return undefined
  return safeString(value)
}

const normaliseProfile = (value: unknown): SupervisorProfileDetails => {
  if (!value || typeof value !== "object") return { ...defaultProfile }
  const record = value as Record<string, unknown>

  return {
    first_name: safeString(record.first_name ?? record.firstName),
    last_name: safeString(record.last_name ?? record.lastName),
    phone_number: safeString(record.phone_number ?? record.phoneNumber),
    address: safeString(record.address ?? record.location ?? record.city),
    emergency_contact_name: safeString(
      record.emergency_contact_name ?? record.emergencyContactName,
    ),
    emergency_contact_phone: safeString(
      record.emergency_contact_phone ?? record.emergencyContactPhone,
    ),
  }
}

const normaliseAccount = (value: unknown): SupervisorAccountSummary | null => {
  if (!value || typeof value !== "object") return null
  const record = value as Record<string, unknown>

  const id = safeString(
    record.id ?? record.user_id ?? record.supervisor_id ?? record.uuid ?? "",
  )
  const email = safeString(record.email ?? record.supervisor_email ?? "")

  if (!id && !email) return null

  return {
    id,
    email,
    role: safeString(record.role ?? "supervisor") || "supervisor",
    full_name: safeString(record.full_name ?? ""),
    nin: toOptionalString(record.nin),
    team_summary: record.team_summary as any,
  }
}

const buildErrorMessage = (error: any): string => {
  const apiMessage =
    error?.response?.data?.message ??
    error?.response?.data?.error ??
    error?.message
  return typeof apiMessage === "string" && apiMessage.trim() !== ""
    ? apiMessage
    : "Unable to process supervisor profile request"
}

const applyProfileUpdates = (
  current: SupervisorProfileDetails | null,
  patch: SupervisorProfileUpdatePayload,
): SupervisorProfileDetails => {
  const base = current ?? { ...defaultProfile }
  return {
    ...base,
    phone_number:
      toOptionalString(patch.phone_number) ?? base.phone_number ?? "",
    emergency_contact_name:
      toOptionalString(patch.emergency_contact_name) ??
      base.emergency_contact_name ??
      "",
    emergency_contact_phone:
      toOptionalString(patch.emergency_contact_phone) ??
      base.emergency_contact_phone ??
      "",
    address: toOptionalString(patch.address) ?? base.address ?? "",
  }
}

const sanitiseUpdatePayload = (
  payload: SupervisorProfileUpdatePayload,
): SupervisorProfileUpdatePayload => {
  const result: SupervisorProfileUpdatePayload = {}
  const keys: (keyof SupervisorProfileUpdatePayload)[] = [
    "phone_number",
    "emergency_contact_name",
    "emergency_contact_phone",
    "address",
  ]

  keys.forEach((key) => {
    const value = toOptionalString(payload[key])
    if (value !== undefined) {
      result[key] = value
    }
  })

  return result
}

export const useSupervisorProfileStore = create<SupervisorProfileState>(
  (set) => ({
    loading: false,
    updating: false,
    error: null,
    updateError: null,
    profile: null,
    account: null,
    lastFetchedAt: null,
    lastSavedAt: null,

    fetchProfile: async () => {
      set({ loading: true, error: null })
      try {
        const response = await api.get("/supervisor/profile")
        console.log("Supervisor profile API response:", response.data)

        // Handle response structure: { success, message, data: { ... } }
        const payload = response.data?.data ?? response.data ?? {}
        console.log("Extracted payload:", payload)

        const profile = normaliseProfile(payload)
        const account = normaliseAccount(payload)

        console.log("Normalised profile:", profile)
        console.log("Normalised account:", account)

        set({
          profile,
          account,
          loading: false,
          error: null,
          lastFetchedAt: new Date().toISOString(),
        })
      } catch (error: any) {
        console.error("Error fetching supervisor profile:", error)
        set({
          loading: false,
          error: buildErrorMessage(error),
        })
      }
    },

    updateProfile: async (payload) => {
      const sanitised = sanitiseUpdatePayload(payload)
      set({ updating: true, updateError: null })
      try {
        await api.put("/supervisor/profile", sanitised)
        set((state) => ({
          updating: false,
          updateError: null,
          profile: applyProfileUpdates(state.profile, sanitised),
          lastSavedAt: new Date().toISOString(),
        }))
      } catch (error: any) {
        set({
          updating: false,
          updateError: buildErrorMessage(error),
        })
      }
    },
  }),
)

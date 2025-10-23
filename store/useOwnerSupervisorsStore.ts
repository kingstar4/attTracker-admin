"use client"

import { create } from "zustand"
import api from "@/lib/api"

export type VerificationStatus = "pending" | "verified"

export interface SupervisorEmployee {
  id: string
  name: string
  email: string
  emailVerified: boolean
  status: VerificationStatus
}

export interface OwnerSupervisorRecord {
  id: string
  name: string
  email: string
  organizationId: string
  organizationName: string
  ownerId: string
  ownerEmail: string
  emailVerified: boolean
  status: VerificationStatus
  createdAt?: string
  employees: SupervisorEmployee[]
}

interface OwnerSupervisorsState {
  supervisors: OwnerSupervisorRecord[]
  loading: boolean
  error: string | null
  lastFetchedAt?: string
  activeOwnerId?: string
  activeOwnerEmail?: string
  fetchOwnerSupervisors: (
    owner?: { ownerId?: string | null; ownerEmail?: string | null },
    options?: { force?: boolean },
  ) => Promise<void>
}

type RawOrgRecord = {
  owner?: {
    id?: string
    email?: string
    name?: string
  }
  organization?: {
    id?: string
    name?: string
    created_at?: string
    description?: string
  }
  supervisors?: Array<{
    id?: string
    name?: string
    email?: string
    email_verified?: boolean
  }>
  employees?: Array<{
    id?: string
    name?: string
    email?: string
    email_verified?: boolean
    supervisor_id?: string
  }>
}

const normString = (value: unknown): string => {
  if (value === undefined || value === null) return ""
  if (typeof value === "string") return value
  if (typeof value === "number" && Number.isFinite(value)) return String(value)
  return ""
}

const toStatus = (emailVerified: boolean): VerificationStatus =>
  emailVerified ? "verified" : "pending"

export const useOwnerSupervisorsStore = create<OwnerSupervisorsState>((set, get) => ({
  supervisors: [],
  loading: false,
  error: null,
  lastFetchedAt: undefined,
  activeOwnerId: undefined,
  activeOwnerEmail: undefined,

  fetchOwnerSupervisors: async (owner, options) => {
    const ownerId = owner?.ownerId ?? get().activeOwnerId ?? null
    const ownerEmail = owner?.ownerEmail ?? get().activeOwnerEmail ?? null
    const normalisedEmail = ownerEmail ? ownerEmail.trim().toLowerCase() : null

    if (!options?.force) {
      if (
        get().lastFetchedAt &&
        (!ownerId || get().activeOwnerId === ownerId) &&
        (!normalisedEmail || get().activeOwnerEmail === normalisedEmail)
      ) {
        return
      }
    }

    set({ loading: true, error: null })
    try {
      const response = await api.get("/debug/db-info")
      const payload = response.data?.data ?? response.data ?? []
      const dataset: RawOrgRecord[] = Array.isArray(payload) ? payload : []

      const matchingRecords = dataset.filter((record) => {
        const recordOwnerId = normString(record.owner?.id)
        const recordOwnerEmail = normString(record.owner?.email).toLowerCase()

        if (ownerId && recordOwnerId && ownerId === recordOwnerId) {
          return true
        }

        if (normalisedEmail && recordOwnerEmail && normalisedEmail === recordOwnerEmail) {
          return true
        }

        return !ownerId && !normalisedEmail
      })

      const supervisors: OwnerSupervisorRecord[] = []

      matchingRecords.forEach((record) => {
        const organizationId = normString(record.organization?.id) || "unknown-org"
        const organizationName = normString(record.organization?.name) || "Unnamed Organization"
        const recordOwnerId = normString(record.owner?.id)
        const recordOwnerEmail = normString(record.owner?.email).toLowerCase()

        const employeesMap = new Map<string, SupervisorEmployee[]>()
        ;(Array.isArray(record.employees) ? record.employees : []).forEach((employee) => {
          const supervisorId = normString(employee.supervisor_id)
          if (!supervisorId) return

          const emailVerified = Boolean(employee.email_verified)
          const collection = employeesMap.get(supervisorId) ?? []
          collection.push({
            id: normString(employee.id) || `${supervisorId}-${collection.length + 1}`,
            name: normString(employee.name) || normString(employee.email) || "Employee",
            email: normString(employee.email),
            emailVerified,
            status: toStatus(emailVerified),
          })
          employeesMap.set(supervisorId, collection)
        })

        ;(Array.isArray(record.supervisors) ? record.supervisors : []).forEach((supervisor) => {
          const supervisorId = normString(supervisor.id) || `${organizationId}-supervisor-${supervisors.length + 1}`

          const emailVerified = Boolean(supervisor.email_verified)
          const employees = employeesMap.get(supervisorId) ?? []
          const supervisorCreatedAt = normString(
            (supervisor as Record<string, unknown>)?.created_at ??
              (supervisor as Record<string, unknown>)?.createdAt ??
              "",
          )

          supervisors.push({
            id: supervisorId,
            name: normString(supervisor.name) || normString(supervisor.email) || "Supervisor",
            email: normString(supervisor.email),
            organizationId,
            organizationName,
            ownerId: recordOwnerId,
            ownerEmail: recordOwnerEmail,
            emailVerified,
            status: toStatus(emailVerified),
            createdAt: supervisorCreatedAt || undefined,
            employees: employees.sort((a, b) => a.name.localeCompare(b.name)),
          })
        })
      })

      supervisors.sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === "verified" ? -1 : 1
        }
        if (a.organizationName !== b.organizationName) {
          return a.organizationName.localeCompare(b.organizationName)
        }
        return a.name.localeCompare(b.name)
      })

      set({
        supervisors,
        loading: false,
        error: null,
        lastFetchedAt: new Date().toISOString(),
        activeOwnerId: ownerId ?? undefined,
        activeOwnerEmail: normalisedEmail ?? undefined,
      })
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Unable to load supervisor data."
      set({ loading: false, error: message })
    }
  },
}))

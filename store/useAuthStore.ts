"use client"

import { create } from "zustand"

export type UserRole = "owner" | "supervisor" | "employee"

export interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  companyName?: string
  role: UserRole
  token?: string
}

interface AuthState {
  user: AuthUser | null
  loading: boolean
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  // Demo async actions (stub) — replace with real API calls
  login: (email: string, password: string, remember?: boolean) => Promise<AuthUser>
  signupOwner: (data: {
    firstName: string
    lastName: string
    companyName: string
    companyEmail: string
    phone: string
    password: string
  }) => Promise<AuthUser>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null }),

  // Mocked login: infers role by email prefix for demo purposes
  login: async (email, password, _remember) => {
    set({ loading: true })
    try {
      await new Promise((r) => setTimeout(r, 600))
      // Very simple demo mapping — replace with server response
      const domain = email.toLowerCase()
      const role: UserRole = domain.startsWith("owner")
        ? "owner"
        : domain.startsWith("supervisor")
        ? "supervisor"
        : "employee"

      if (!password || password.length < 2) {
        throw new Error("Invalid credentials")
      }

      const user: AuthUser = {
        id: "demo-" + Math.random().toString(36).slice(2),
        email,
        role,
        firstName: role === "owner" ? "Owner" : role === "supervisor" ? "Supervisor" : "Employee",
        lastName: "User",
        token: "mock-jwt-token",
      }
      set({ user })
      return user
    } finally {
      set({ loading: false })
    }
  },

  // Mocked owner signup — returns owner user
  signupOwner: async (data) => {
    set({ loading: true })
    try {
      await new Promise((r) => setTimeout(r, 800))
      const user: AuthUser = {
        id: "owner-" + Math.random().toString(36).slice(2),
        email: data.companyEmail,
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
        role: "owner",
        token: "mock-jwt-token",
      }
      set({ user })
      return user
    } finally {
      set({ loading: false })
    }
  },
}))


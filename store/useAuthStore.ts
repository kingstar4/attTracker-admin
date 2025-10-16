"use client"

import { create } from "zustand"
import api from "@/lib/api"
import { useUserStore } from "./useUserStore"

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
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<AuthUser>
  signupOwner: (data: SignupOwnerInput) => Promise<AuthUser>
}

interface SignupOwnerInput {
  organization_name: string
  owner_email: string
  owner_password: string
  description: string
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,

  setUser: (user) => {
    set({ user })
    useUserStore.getState().setUser(user)
  },
  setLoading: (loading) => set({ loading }),

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")
    useUserStore.getState().clear()
    set({ user: null })
  },

  login: async (email, password, rememberMe = false) => {
    set({ loading: true })
    try {
      const response = await api.post("/auth/login", { email, password })
      const data = response.data?.data ?? response.data

      const token =
        data?.access_token ?? data?.token ?? response.data?.token ?? null
      const userData =
        data?.user ?? data?.owner ?? data?.employee ?? data?.supervisor

      if (!token || !userData) throw new Error("Invalid login response")

      const user: AuthUser = {
        id: userData.id || userData._id,
        email: userData.email ?? email,
        firstName: userData.first_name ?? userData.firstName,
        lastName: userData.last_name ?? userData.lastName,
        companyName:
          userData.company_name ??
          userData.organization_name ??
          data?.organization_name,
        role: (userData.role as UserRole) ?? "owner",
        token,
      }

      if (rememberMe) {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("user")
      } else {
        sessionStorage.setItem("token", token)
        sessionStorage.setItem("user", JSON.stringify(user))
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }

      set({ user })
      useUserStore.getState().setUser(user)

      return user
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Login failed"
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  },

  signupOwner: async (data) => {
    set({ loading: true })
    try {
      await api.post("/auth/register-organization", data)
      const user = await get().login(
        data.owner_email,
        data.owner_password,
        true
      )
      return user
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Signup failed"
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  },
}))

import { create } from "zustand"
import type { AuthUser, UserRole } from "./useAuthStore"

interface UserState {
  role: UserRole | null
  user: AuthUser | null
  setRole: (role: UserRole | null) => void
  setUser: (user: AuthUser | null) => void
  clear: () => void
}

export const useUserStore = create<UserState>((set) => ({
  role: null,
  user: null,
  setRole: (role) => set({ role }),
  setUser: (user) => set({ user, role: user?.role ?? null }),
  clear: () => set({ role: null, user: null }),
}))

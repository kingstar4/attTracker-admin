import { create } from "zustand"

type Role = "owner" | "supervisor" | "employee" | null

interface UserState {
  role: Role
  setRole: (role: Role) => void
}

export const useUserStore = create<UserState>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
}))

import { create } from "zustand"

interface AppState {
  isDarkMode: boolean
  isContactModalOpen: boolean
  toggleDarkMode: () => void
  openContactModal: () => void
  closeContactModal: () => void
}

export const useLandingPageStore = create<AppState>((set) => ({
  isDarkMode: true, // Default to dark mode for premium look
  isContactModalOpen: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  openContactModal: () => set({ isContactModalOpen: true }),
  closeContactModal: () => set({ isContactModalOpen: false }),
}))

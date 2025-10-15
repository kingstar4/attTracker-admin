import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AppState {
  isDarkMode: boolean
  isContactModalOpen: boolean
  toggleDarkMode: () => void
  openContactModal: () => void
  closeContactModal: () => void
}

// Function to get initial theme based on system preference or localStorage
const getInitialTheme = (): boolean => {
  if (typeof window === "undefined") return true // SSR default
  
  // Check localStorage first
  const stored = localStorage.getItem("landing-theme")
  if (stored !== null) {
    return JSON.parse(stored).state.isDarkMode
  }
  
  // Fall back to system preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export const useLandingPageStore = create<AppState>()(
  persist(
    (set) => ({
      isDarkMode: getInitialTheme(),
      isContactModalOpen: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      openContactModal: () => set({ isContactModalOpen: true }),
      closeContactModal: () => set({ isContactModalOpen: false }),
    }),
    {
      name: "landing-theme",
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
)

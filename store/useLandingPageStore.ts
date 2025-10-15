import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AppState {
  isDarkMode: boolean
  isContactModalOpen: boolean
  toggleDarkMode: () => void
  openContactModal: () => void
  closeContactModal: () => void
}

// Function to get initial theme based on system preference
const getInitialTheme = (): boolean => {
  if (typeof window === "undefined") return true // SSR default
  
  try {
    // Check localStorage first
    const stored = localStorage.getItem("landing-theme")
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && typeof parsed.state?.isDarkMode === "boolean") {
        return parsed.state.isDarkMode
      }
    }
  } catch (error) {
    // If parsing fails, clear the corrupted data
    console.warn("Failed to parse theme from localStorage, using system preference")
    localStorage.removeItem("landing-theme")
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

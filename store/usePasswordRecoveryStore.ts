"use client"

import { create } from "zustand"
import api from "@/lib/api"

interface PasswordRecoveryState {
  loading: boolean
  error: string | null
  success: boolean
  successMessage: string | null
  email: string | null
  resetToken: string | null

  // Forgot password
  forgotPassword: (email: string) => Promise<void>
  clearForgotPasswordState: () => void

  // Reset password
  resetPassword: (
    token: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>
  clearResetPasswordState: () => void

  // Clear all state
  clearAll: () => void
}

const buildErrorMessage = (error: any): string => {
  const apiMessage =
    error?.response?.data?.message ??
    error?.response?.data?.error ??
    error?.message
  return typeof apiMessage === "string" && apiMessage.trim() !== ""
    ? apiMessage
    : "An error occurred"
}

export const usePasswordRecoveryStore = create<PasswordRecoveryState>(
  (set) => ({
    loading: false,
    error: null,
    success: false,
    successMessage: null,
    email: null,
    resetToken: null,

    forgotPassword: async (email) => {
      set({ loading: true, error: null, success: false, successMessage: null })
      try {
        const response = await api.post("/auth/forgot-password", { email })
        console.log("Forgot password response:", response.data)

        set({
          loading: false,
          success: true,
          successMessage:
            response.data?.message ??
            "Password reset link has been sent to your email",
          email,
          error: null,
        })
      } catch (error: any) {
        console.error("Forgot password error:", error)
        set({
          loading: false,
          error: buildErrorMessage(error),
          success: false,
          successMessage: null,
        })
        throw error
      }
    },

    resetPassword: async (token, password, confirmPassword) => {
      set({ loading: true, error: null, success: false, successMessage: null })
      try {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match")
        }

        const response = await api.post("/auth/reset-password", {
          token,
          password,
          confirm_password: confirmPassword,
        })
        console.log("Reset password response:", response.data)

        set({
          loading: false,
          success: true,
          successMessage:
            response.data?.message ?? "Password has been reset successfully",
          resetToken: token,
          error: null,
        })
      } catch (error: any) {
        console.error("Reset password error:", error)
        set({
          loading: false,
          error: buildErrorMessage(error),
          success: false,
          successMessage: null,
        })
        throw error
      }
    },

    clearForgotPasswordState: () => {
      set({
        loading: false,
        error: null,
        success: false,
        successMessage: null,
        email: null,
      })
    },

    clearResetPasswordState: () => {
      set({
        loading: false,
        error: null,
        success: false,
        successMessage: null,
        resetToken: null,
      })
    },

    clearAll: () => {
      set({
        loading: false,
        error: null,
        success: false,
        successMessage: null,
        email: null,
        resetToken: null,
      })
    },
  })
)

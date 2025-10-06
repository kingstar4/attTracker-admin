"use client"

import React, { useEffect, useState, createContext, useContext } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Layout } from './layout/Layout'

// Hardcoded credentials for static export
const HARDCODED_EMAIL = 'admin@example.com'
const HARDCODED_PASSWORD = 'password123'

type AuthContextType = {
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthWrapper')
  return context
}

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check auth state on mount from localStorage
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('auth')
      setIsAuthenticated(!!auth)
      setLoading(false)
    }
    // Need to wrap in try-catch because localStorage might not be available during SSR
    try {
      checkAuth()
    } catch {
      setLoading(false)
    }
  }, [])

  // Redirect to login when not authenticated (except on login page)
  useEffect(() => {
    if (!loading && !isAuthenticated && !pathname?.startsWith('/login')) {
      router.replace('/login')
    }
  }, [loading, isAuthenticated, pathname, router])

  const login = async (email: string, password: string) => {
    if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
      localStorage.setItem('auth', '1')
      setIsAuthenticated(true)
      router.push('/')
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('auth')
    setIsAuthenticated(false)
    router.replace('/login')
  }

  const value = {
    isAuthenticated,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">Loading…</div>
      ) : pathname?.startsWith('/login') ? (
        children
      ) : isAuthenticated ? (
        <Layout>{children}</Layout>
      ) : null}
    </AuthContext.Provider>
  )
}
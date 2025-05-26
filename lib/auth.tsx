"use client"

import React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo credentials for testing
const DEMO_CREDENTIALS = {
  email: "admin",
  password: "admin",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // Check if it's demo credentials first
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        // Create a mock user session for demo purposes
        const mockUser: User = {
          id: "demo-user-id",
          email: DEMO_CREDENTIALS.email,
          user_metadata: {
            full_name: "Demo Admin",
          },
          app_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email_confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          role: "authenticated",
          confirmation_sent_at: undefined,
          confirmed_at: new Date().toISOString(),
          recovery_sent_at: undefined,
          email_change_sent_at: undefined,
          new_email: undefined,
          invited_at: undefined,
          action_link: undefined,
          phone: undefined,
          phone_confirmed_at: undefined,
          factors: undefined,
          identities: [],
        }

        setUser(mockUser)

        // Store demo session in localStorage for persistence
        localStorage.setItem(
          "demo-session",
          JSON.stringify({
            user: mockUser,
            expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
          }),
        )

        return {}
      }

      // Try regular Supabase authentication for real users
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error: any) {
      return { error: error.message || "An unexpected error occurred" }
    }
  }

  const signOut = async () => {
    // Clear demo session
    localStorage.removeItem("demo-session")

    // Sign out from Supabase
    await supabase.auth.signOut()
    setUser(null)
  }

  // Check for demo session on mount
  useEffect(() => {
    const checkDemoSession = () => {
      const demoSession = localStorage.getItem("demo-session")
      if (demoSession) {
        try {
          const session = JSON.parse(demoSession)
          if (session.expires_at > Date.now()) {
            setUser(session.user)
          } else {
            localStorage.removeItem("demo-session")
          }
        } catch (error) {
          localStorage.removeItem("demo-session")
        }
      }
      setLoading(false)
    }

    // Only check demo session if no Supabase session exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        checkDemoSession()
      } else {
        setLoading(false)
      }
    })
  }, [])

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

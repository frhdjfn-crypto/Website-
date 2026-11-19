"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

type User = {
  name: string
  email: string
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  library: string[]
  addToLibrary: (bookTitle: string) => void
  removeFromLibrary: (bookTitle: string) => void
  viewLibrary: () => string[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function toUser(supabaseUser: SupabaseUser | null): User {
  if (!supabaseUser?.email) return null
  const name = (supabaseUser.user_metadata?.name as string | undefined) ?? supabaseUser.email
  return { name, email: supabaseUser.email }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User>(null)
  const [library, setLibrary] = useState<string[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(toUser(data.user)))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toUser(session?.user ?? null))
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setLibrary([])
  }

  const addToLibrary = (bookTitle: string) => {
    if (!library.includes(bookTitle)) {
      setLibrary([...library, bookTitle])
    }
  }

  const removeFromLibrary = (bookTitle: string) => {
    setLibrary(library.filter((title) => title !== bookTitle))
  }

  const viewLibrary = () => {
    return library
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        library,
        addToLibrary,
        removeFromLibrary,
        viewLibrary,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

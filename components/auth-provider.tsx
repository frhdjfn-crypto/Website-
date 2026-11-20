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
  isAdmin: boolean
  login: (email: string, password: string) => Promise<boolean>
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
  const [isAdmin, setIsAdmin] = useState(false)
  const [library, setLibrary] = useState<string[]>([])

  useEffect(() => {
    let active = true
    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return
      setUser(toUser(data.user))
      if (data.user) {
        const { data: admin } = await supabase.rpc("is_admin")
        if (active) setIsAdmin(admin === true)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toUser(session?.user ?? null))
      if (!session?.user) setIsAdmin(false)
    })

    return () => { active = false; subscription.unsubscribe() }
  }, [supabase])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const { data: admin, error: adminError } = await supabase.rpc("is_admin")
    if (adminError) throw adminError
    setIsAdmin(admin === true)
    return admin === true
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
        isAdmin,
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

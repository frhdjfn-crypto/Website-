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
    const loadLibrary = async (userId: string) => {
      const { data } = await supabase.from("user_library").select("book_id, books(title)").eq("user_id", userId)
      if (!active || !data) return
      setLibrary(data.flatMap((row) => {
        const book = Array.isArray(row.books) ? row.books[0] : row.books
        return book?.title ? [book.title] : []
      }))
    }
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      setUser(toUser(data.user))
      if (data.user) {
        const [{ data: admin },] = await Promise.all([supabase.rpc("is_admin"), loadLibrary(data.user.id)])
        if (active) setIsAdmin(admin === true)
      }
    }
    void loadUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null
      setUser(toUser(nextUser))
      if (!nextUser) { setIsAdmin(false); setLibrary([]) }
      else { void loadLibrary(nextUser.id); void supabase.rpc("is_admin").then(({ data }) => { if (active) setIsAdmin(data === true) }) }
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

  const addToLibrary = async (bookTitle: string) => {
    if (library.includes(bookTitle)) return
    setLibrary((current) => [...current, bookTitle])
    if (user) {
      const { data: book } = await supabase.from("books").select("id").eq("title", bookTitle).maybeSingle()
      if (!book) { setLibrary((current) => current.filter((title) => title !== bookTitle)); return }
      const { error } = await supabase.from("user_library").insert({ user_id: (await supabase.auth.getUser()).data.user?.id, book_id: book.id })
      if (error && error.code !== "23505") setLibrary((current) => current.filter((title) => title !== bookTitle))
    }
  }

  const removeFromLibrary = async (bookTitle: string) => {
    setLibrary((current) => current.filter((title) => title !== bookTitle))
    if (user) {
      const { data: book } = await supabase.from("books").select("id").eq("title", bookTitle).maybeSingle()
      const { data: auth } = await supabase.auth.getUser()
      if (book && auth.user) await supabase.from("user_library").delete().eq("user_id", auth.user.id).eq("book_id", book.id)
    }
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

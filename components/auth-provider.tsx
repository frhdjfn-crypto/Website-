"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  name: string
  email: string
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  library: string[]
  addToLibrary: (bookTitle: string) => void
  removeFromLibrary: (bookTitle: string) => void
  viewLibrary: () => string[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [library, setLibrary] = useState<string[]>([])

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const savedLibrary = localStorage.getItem("library")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    if (savedLibrary) {
      setLibrary(JSON.parse(savedLibrary))
    }
  }, [])

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  // Save library to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("library", JSON.stringify(library))
  }, [library])

  const login = async (email: string, password: string) => {
    // Mock login - in a real app, this would call an API
    setUser({ name: "محمد أحمد", email })
  }

  const signup = async (name: string, email: string, password: string) => {
    // Mock signup - in a real app, this would call an API
    // Just returning for now, user would need to login after signup
    return
  }

  const logout = () => {
    setUser(null)
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

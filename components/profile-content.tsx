"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Download, LogOut, Mail, UserRound } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProfileContent({ name, email }: { name: string; email: string }) {
  const { library, logout } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logout()
      router.replace("/auth")
      router.refresh()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header>
        <p className="text-sm font-medium text-primary">حسابك</p>
        <h1 className="mt-1 text-3xl font-bold">الملف الشخصي</h1>
      </header>
      <Card>
        <CardHeader>
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound className="size-6" aria-hidden="true" />
          </div>
          <CardTitle>{name}</CardTitle>
          <CardDescription>معلومات حسابك ومكتبتك الشخصية</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Mail className="size-4" aria-hidden="true" />
            <span dir="ltr" className="break-all text-left">{email}</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-4">
            <BookOpen className="size-5 text-primary" aria-hidden="true" />
            <span className="font-medium">{library.length} كتاب في مكتبتك</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button variant="outline" onClick={() => router.push("/library")}>
              <BookOpen data-icon="inline-start" /> مكتبتي
            </Button>
            <Button variant="outline" onClick={() => router.push("/downloads")}>
              <Download data-icon="inline-start" /> سجل التحميلات
            </Button>
          </div>
          <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "جارٍ تسجيل الخروج" : <><LogOut data-icon="inline-start" /> تسجيل الخروج</>}
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

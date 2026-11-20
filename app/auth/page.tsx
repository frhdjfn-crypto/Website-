"use client"

import { Suspense, useState, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, LockKeyhole, Mail, UserRound } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

function getArabicAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : ""
  if (message.includes("Invalid login credentials")) return "البريد أو كلمة المرور غير صحيحة"
  if (message.includes("Email not confirmed")) return "يرجى تأكيد بريدك الإلكتروني أولاً"
  if (message.includes("User already registered")) return "هذا البريد مسجّل مسبقاً"
  return "حدث خطأ، حاول مرة أخرى"
}

function AuthContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login, signup } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState(searchParams.get("mode") === "signup" ? "signup" : "login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (event.nativeEvent instanceof Event && "isComposing" in event.nativeEvent && event.nativeEvent.isComposing) return
    setErrorMessage("")

    if (activeTab === "signup" && password !== confirmPassword) {
      setErrorMessage("كلمتا المرور غير متطابقتين")
      return
    }

    setLoading(true)
    try {
      if (activeTab === "signup") {
        await signup(name.trim(), email.trim(), password)
        toast({ title: "تم إنشاء الحساب، افتح رسالة التأكيد في بريدك ثم سجّل الدخول" })
        setActiveTab("login")
        setPassword("")
        setConfirmPassword("")
      } else {
        const isAdmin = await login(email.trim(), password)
        const next = searchParams.get("next") ?? "/"
        router.push(isAdmin ? "/admin" : next.startsWith("/") && !next.startsWith("//") ? next : "/")
        router.refresh()
      }
    } catch (error) {
      setErrorMessage(getArabicAuthError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-border/70 shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UserRound className="size-6" aria-hidden="true" />
        </div>
        <CardTitle className="text-2xl">مرحباً بك في زيتونة بوك</CardTitle>
        <CardDescription>سجّل الدخول لمتابعة مكتبتك واكتشاف المزيد من الكتب</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setErrorMessage("") }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="signup">حساب جديد</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <AuthFields email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
              {errorMessage && <p role="alert" className="text-sm text-destructive">{errorMessage}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <><Loader2 className="size-4 animate-spin" aria-hidden="true" /> جارٍ تسجيل الدخول</> : "تسجيل الدخول"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup" className="mt-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-name">الاسم</Label>
                <Input id="signup-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} />
              </div>
              <AuthFields email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                <Input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={6} />
              </div>
              {errorMessage && <p role="alert" className="text-sm text-destructive">{errorMessage}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <><Loader2 className="size-4 animate-spin" aria-hidden="true" /> جارٍ إنشاء الحساب</> : "إنشاء حساب"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function AuthFields({
  email,
  setEmail,
  password,
  setPassword,
}: {
  email: string
  setEmail: (value: string) => void
  password: string
  setPassword: (value: string) => void
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="auth-email">البريد الإلكتروني</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input id="auth-email" type="email" autoComplete="email" dir="ltr" className="pr-10 text-left" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="auth-password">كلمة المرور</Label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input id="auth-password" type="password" autoComplete="current-password" className="pr-10" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
        </div>
      </div>
    </>
  )
}

export default function AuthPage() {
  return (
    <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-10">
      <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-xl bg-muted" aria-label="جارٍ تحميل صفحة الدخول" />}>
        <AuthContent />
      </Suspense>
    </main>
  )
}

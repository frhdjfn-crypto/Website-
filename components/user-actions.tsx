"use client"

import { useState } from "react"
import { Lock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export function UserActions() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const { toast } = useToast()
  const { user, login, signup, logout, library } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    try {
      await login(email, password)
      setIsLoginOpen(false)
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في زيتونة بوك",
      })
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "يرجى التحقق من بيانات الدخول",
        variant: "destructive",
      })
    }
  }

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "خطأ في التسجيل",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await signup(name.trim(), email.trim(), password)
      setIsSignupOpen(false)
      if (result.emailConfirmationRequired) {
        toast({
          title: "بقيت خطوة لإكمال الحساب",
          description: "افتح رابط التأكيد المرسل إلى بريدك الإلكتروني قبل تسجيل الدخول",
        })
      } else {
        setIsLoginOpen(true)
        toast({
          title: "تم إنشاء الحساب وتسجيل الدخول بنجاح",
          description: "مرحباً بك في زيتونة بوك",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ في التسجيل",
        description: "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive",
      })
    }
  }

  const handleViewLibrary = () => {
    if (user) {
      router.push("/library")
    } else {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب تسجيل الدخول أولاً لعرض مكتبتك الشخصية",
      })
    }
  }

  const handleUserAction = () => {
    if (user) {
      toast({
        title: "مرحباً",
        description: `مرحباً ${user.name}!`,
      })
    } else {
      setIsLoginOpen(true)
    }
  }

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <Button onClick={handleUserAction}>
        <Lock className="mr-2 h-4 w-4" />
        {user ? "حسابي" : "تسجيل الدخول"}
      </Button>

      <Button variant="outline" onClick={handleViewLibrary}>
        <BookOpen className="mr-2 h-4 w-4" />
        مكتبتي {user && library.length > 0 && `(${library.length})`}
      </Button>

      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">تسجيل الدخول</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input
              dir="ltr"
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              dir="ltr"
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin} className="w-full">
              دخول
            </Button>
            <p className="text-center">
              ليس لديك حساب؟{" "}
              <Button
                variant="link"
                className="p-0"
                onClick={() => {
                  setIsLoginOpen(false)
                  setIsSignupOpen(true)
                }}
              >
                سجّل الآن
              </Button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signup Dialog */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">تسجيل حساب جديد</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} />
            <Input
              dir="ltr"
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              dir="ltr"
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              dir="ltr"
              type="password"
              placeholder="تأكيد كلمة المرور"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button onClick={handleSignup} className="w-full">
              سجّل
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

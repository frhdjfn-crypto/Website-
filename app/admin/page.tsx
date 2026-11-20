import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()

  if (!adminEmail || !user?.email || user.email.trim().toLowerCase() !== adminEmail) {
    redirect("/")
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </div>
          <CardTitle>لوحة الإدارة</CardTitle>
          <CardDescription>تم التحقق من صلاحية الوصول على الخادم.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          صلاحيات الإدارة متاحة للحساب المصرح به فقط.
        </CardContent>
      </Card>
    </main>
  )
}

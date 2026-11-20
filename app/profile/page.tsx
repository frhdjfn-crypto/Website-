import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileContent } from "@/components/profile-content"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) redirect("/auth?next=%2Fprofile")

  return (
    <main className="container mx-auto px-4 py-10">
      <ProfileContent name={(user.user_metadata?.name as string | undefined) ?? user.email} email={user.email} />
    </main>
  )
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard, type DashboardBook, type DashboardSettings } from "@/components/admin-dashboard"
import { getAdminUsers } from "./actions"

export const metadata: Metadata = { robots: { index: false, follow: false } }

const defaultSettings: DashboardSettings = {
  site_name: "زيتونة بوك",
  hero_title: "مرحباً بك في زيتونة بوك",
  hero_subtitle: "اكتشف عالماً من المعرفة مع آلاف الكتب العربية والعالمية",
  footer_text: "منصة رائدة للكتب العربية والعالمية. اكتشف آلاف الكتب في مختلف المجالات، واقرأ وحمّل مجاناً.",
  contact_email: "info@zeitounabook.com",
  contact_phone: "+966 11 123 4567",
  show_random: true,
  show_newest: true,
  show_most_downloaded: true,
  show_most_rated: true,
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin")
  if (adminError || isAdmin !== true) notFound()

  const [booksResult, categoriesResult, settingsResult, downloadsResult, recentDownloadsResult, users] = await Promise.all([
    supabase.from("books").select("id,title,author,category,year,pages,language,description,image_url,download_url,download_count").order("id", { ascending: false }),
    supabase.from("categories").select("name").order("name"),
    supabase.from("site_settings").select("site_name,hero_title,hero_subtitle,footer_text,contact_email,contact_phone,show_random,show_newest,show_most_downloaded,show_most_rated").eq("id", true).maybeSingle(),
    supabase.from("downloads").select("id", { count: "exact", head: true }),
    supabase.from("downloads").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    getAdminUsers(),
  ])

  const books = (booksResult.data ?? []) as DashboardBook[]
  const bookCounts = new Map<string, number>()
  for (const book of books) bookCounts.set(book.category, (bookCounts.get(book.category) ?? 0) + 1)
  const categories = (categoriesResult.data ?? [...bookCounts.keys()].map((name) => ({ name }))).map(({ name }) => ({ name, count: bookCounts.get(name) ?? 0 })).sort((a, b) => a.name.localeCompare(b.name, "ar"))
  const topBooks = [...books].sort((a, b) => (b.download_count ?? 0) - (a.download_count ?? 0)).slice(0, 5)
  return <AdminDashboard books={books} categories={categories} settings={{ ...defaultSettings, ...(settingsResult.data ?? {}) }} users={users} stats={{ totalBooks: books.length, totalUsers: users.length, downloads: downloadsResult.count ?? 0, weeklyDownloads: recentDownloadsResult.count ?? 0, topBooks }} />
}

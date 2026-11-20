"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export type AdminBookInput = {
  id?: number
  title: string
  author: string
  category: string
  year: number | null
  pages: number | null
  language: string
  description: string
  image_url: string | null
  download_url: string | null
}

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("غير مصرح")
  const { data, error } = await supabase.rpc("is_admin")
  if (error || data !== true) throw new Error("غير مصرح")
  return supabase
}

function refreshSite() {
  revalidatePath("/", "layout")
}

export async function saveBook(input: AdminBookInput) {
  const supabase = await requireAdmin()
  const payload = {
    title: input.title.trim(),
    author: input.author.trim(),
    category: input.category.trim(),
    year: input.year,
    pages: input.pages,
    language: input.language.trim() || "العربية",
    description: input.description.trim() || null,
    image_url: input.image_url,
    download_url: input.download_url,
    format: "PDF",
  }
  if (!payload.title || !payload.author || !payload.category) throw new Error("الحقول المطلوبة غير مكتملة")
  const result = input.id
    ? await supabase.from("books").update(payload).eq("id", input.id)
    : await supabase.from("books").insert(payload)
  if (result.error) throw new Error("تعذر حفظ الكتاب")
  const { error: categoryError } = await supabase.from("categories").upsert({ name: payload.category }, { onConflict: "name", ignoreDuplicates: true })
  if (categoryError) throw new Error("تم حفظ الكتاب لكن تعذر تحديث قائمة التصنيفات")
  refreshSite()
}

function storageObjectPath(url: string | null) {
  if (!url) return null
  const marker = "/storage/v1/object/public/books/"
  const index = url.indexOf(marker)
  return index >= 0 ? decodeURIComponent(url.slice(index + marker.length)) : null
}

export async function deleteBook(id: number) {
  const supabase = await requireAdmin()
  const { data: book, error: readError } = await supabase.from("books").select("image_url,download_url").eq("id", id).single()
  if (readError) throw new Error("تعذر العثور على الكتاب")
  const { error } = await supabase.from("books").delete().eq("id", id)
  if (error) throw new Error("تعذر حذف الكتاب")
  const paths = [storageObjectPath(book.image_url), storageObjectPath(book.download_url)].filter((path): path is string => Boolean(path))
  if (paths.length) await supabase.storage.from("books").remove(paths)
  refreshSite()
}

export async function renameCategory(previousName: string, nextName: string) {
  const supabase = await requireAdmin()
  const normalized = nextName.trim()
  if (!normalized) throw new Error("اسم التصنيف مطلوب")
  const { error } = await supabase.rpc("rename_category", { p_old: previousName, p_new: normalized })
  if (error) throw new Error("تعذر تعديل التصنيف")
  refreshSite()
}

export async function deleteCategory(name: string) {
  const supabase = await requireAdmin()
  const { count, error: countError } = await supabase.from("books").select("id", { count: "exact", head: true }).eq("category", name)
  if (countError) throw new Error("تعذر التحقق من الكتب المرتبطة")
  if ((count ?? 0) > 0) throw new Error("لا يمكن حذف تصنيف يحتوي على كتب")
  const { error } = await supabase.from("categories").delete().eq("name", name)
  if (error) throw new Error("تعذر حذف التصنيف")
  refreshSite()
}

export type SiteSettingsInput = {
  site_name: string
  hero_title: string
  hero_subtitle: string
  footer_text: string
  contact_email: string
  contact_phone: string
  show_random: boolean
  show_newest: boolean
  show_most_downloaded: boolean
  show_most_rated: boolean
}

export async function saveSiteSettings(settings: SiteSettingsInput) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from("site_settings").upsert({ id: true, ...settings }, { onConflict: "id" })
  if (error) throw new Error("تعذر حفظ إعدادات الموقع")
  refreshSite()
}

export type AdminUser = { id: string; email: string | undefined; created_at: string; last_sign_in_at: string | null }

export async function getAdminUsers(): Promise<AdminUser[]> {
  await requireAdmin()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error("خدمة إدارة المستخدمين غير مهيأة")
  const adminClient = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const users: AdminUser[] = []
  for (let page = 1; page <= 100; page++) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw new Error("تعذر جلب المستخدمين")
    users.push(...data.users.map(({ id, email, created_at, last_sign_in_at }) => ({ id, email, created_at, last_sign_in_at: last_sign_in_at ?? null })))
    if (data.users.length < 1000) break
  }
  return users
}

export async function deleteAdminUser(userId: string) {
  const supabase = await requireAdmin()
  const { data: { user: caller } } = await supabase.auth.getUser()
  if (caller?.id === userId) throw new Error("لا يمكن حذف حسابك من لوحة الإدارة")
  if (!/^[0-9a-f-]{36}$/i.test(userId)) throw new Error("معرف المستخدم غير صالح")
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error("خدمة إدارة المستخدمين غير مهيأة")
  const adminClient = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { error } = await adminClient.auth.admin.deleteUser(userId)
  if (error) throw new Error("تعذر حذف المستخدم")
  refreshSite()
}

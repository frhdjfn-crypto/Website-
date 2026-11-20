import { createClient } from "@/lib/supabase/server"

export type SiteSettings = {
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

export const defaultSiteSettings: SiteSettings = {
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

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("site_settings").select("site_name,hero_title,hero_subtitle,footer_text,contact_email,contact_phone,show_random,show_newest,show_most_downloaded,show_most_rated").eq("id", true).maybeSingle()
    return { ...defaultSiteSettings, ...(data ?? {}) }
  } catch {
    return defaultSiteSettings
  }
}

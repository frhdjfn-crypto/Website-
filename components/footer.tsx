"use client"

import type React from "react"

import { Book, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import type { SiteSettings } from "@/lib/site-settings"

export function Footer({ settings }: { settings: SiteSettings }) {
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      toast({
        title: "تم الاشتراك بنجاح",
        description: "شكراً لك! ستصلك أحدث الكتب والعروض على بريدك الإلكتروني",
      })
      setEmail("")
    }
  }

  const footerLinks = {
    explore: [
      { href: "/", label: "الصفحة الرئيسية" },
      { href: "/categories", label: "التصنيفات" },
      { href: "/authors", label: "المؤلفون" },
      { href: "/trending", label: "الأكثر تحميلاً" },
    ],
    account: [
      { href: "/library", label: "مكتبتي الشخصية" },
      { href: "/downloads", label: "التحميلات" },
      { href: "/profile", label: "الملف الشخصي" },
      { href: "/auth", label: "تسجيل الدخول" },
    ],
    support: [
      { href: `mailto:${settings.contact_email}`, label: "اتصل بنا" },
      { href: "/categories", label: "استكشف التصنيفات" },
      { href: "/authors", label: "المؤلفون" },
    ],
  }

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* معلومات الموقع */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Book className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold text-primary">{settings.site_name}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">{settings.footer_text}</p>
            <div className="space-y-2">
              <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <Mail className="h-4 w-4" />
                <span dir="ltr">{settings.contact_email}</span>
              </a>
              <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <Phone className="h-4 w-4" />
                <span dir="ltr">{settings.contact_phone}</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>

          {/* روابط الاستكشاف */}
          <div className="space-y-4">
            <h4 className="font-semibold">استكشف</h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* روابط الحساب */}
          <div className="space-y-4">
            <h4 className="font-semibold">حسابي</h4>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* النشرة الإخبارية */}
          <div className="space-y-4">
            <h4 className="font-semibold">النشرة الإخبارية</h4>
            <p className="text-sm text-muted-foreground">اشترك ليصلك أحدث الكتب والعروض الحصرية</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
              <Button type="submit" className="w-full">
                اشترك الآن
              </Button>
            </form>
          </div>
        </div>

        {/* الخط الفاصل */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* حقوق النشر */}
            <div className="text-sm text-muted-foreground">© 2024 زيتونة بوك. جميع الحقوق محفوظة.</div>

            {/* روابط المساعدة */}
            <div className="flex items-center gap-4">
              {footerLinks.support.slice(0, 3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* وسائل التواصل الاجتماعي */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_Arabic } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getSiteSettings } from "@/lib/site-settings"
import { getAllBooks, getCategories } from "@/lib/books-db"
import { Analytics } from "@vercel/analytics/next"

export const revalidate = 60

const arabicFont = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://zeitounabook.com"),
  title: { default: "زيتونة بوك", template: "%s | زيتونة بوك" },
  description: "منصة للكتب العربية والعالمية - اكتشف، اقرأ، وحمّل آلاف الكتب",
  generator: "v0.dev",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [settings, books, categories] = await Promise.all([getSiteSettings(), getAllBooks(), getCategories()])
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${arabicFont.className} ${arabicFont.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="zeitouna-theme">
          <AuthProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Header siteName={settings.site_name} books={books} categories={categories} />
              <main className="flex-1">{children}</main>
              <Footer settings={settings} />
              <Toaster />
              <SonnerToaster />
              <Analytics />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

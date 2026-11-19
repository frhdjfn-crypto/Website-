import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_Arabic } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const arabicFont = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
})

export const metadata: Metadata = {
  title: "📚 زيتونة بوك | Zeitouna Book",
  description: "منصة للكتب العربية والعالمية - اكتشف، اقرأ، وحمّل آلاف الكتب",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${arabicFont.className} ${arabicFont.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="zeitouna-theme">
          <AuthProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

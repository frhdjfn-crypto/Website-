"use client"

import type React from "react"

import { Book, Menu, X, Search, User, BookOpen, List, Users, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { SearchSuggestions } from "@/components/search-suggestions"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header({ siteName }: { siteName: string }) {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { user, isAdmin, library, logout } = useAuth()
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const handleUserAction = () => {
    if (user) {
      router.push("/profile")
    } else {
      router.push("/auth")
    }
  }

  const navigationItems = [
    { href: "/", label: "الرئيسية", icon: BookOpen },
    { href: "/categories", label: "التصنيفات", icon: List },
    { href: "/authors", label: "المؤلفون", icon: Users },
    { href: "/library", label: "مكتبتي", icon: Book, badge: user && library.length > 0 ? library.length : null },
    { href: "/downloads", label: "التحميلات", icon: Download },
  ]

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Book className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold text-primary">{siteName}</h1>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* الشعار */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <Book className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">{siteName}</h1>
        </Link>

        {/* شريط البحث - مخفي على الشاشات الصغيرة */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <div className="relative w-full">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="ابحث عن الكتب والمؤلفين..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pr-10 w-full"
            />
            {showSuggestions && searchQuery.length > 1 && (
              <SearchSuggestions
                query={searchQuery}
                onSuggestionClick={(suggestion) => {
                  setSearchQuery(suggestion)
                  setShowSuggestions(false)
                  router.push(`/search?q=${encodeURIComponent(suggestion)}`)
                }}
                className="absolute top-full left-0 right-0 mt-1 z-50"
              />
            )}
          </div>
        </form>

        {/* روابط التنقل - مخفية على الشاشات الصغيرة */}
        <nav className="hidden lg:flex items-center gap-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        {/* أزرار الإجراءات */}
        <div className="flex items-center gap-2">
          {/* زر البحث للشاشات الصغيرة */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Search className="h-4 w-4" />
          </Button>

          {/* زر تبديل الوضع المحسن */}
          <ThemeToggle />

          {/* قائمة المستخدم */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user ? user.name : "تسجيل الدخول"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    الملف الشخصي
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/library")}>
                    <Book className="mr-2 h-4 w-4" />
                    مكتبتي ({library.length})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/downloads")}>
                    <Download className="mr-2 h-4 w-4" />
                    التحميلات
                  </DropdownMenuItem>
                  {isAdmin && <DropdownMenuItem onClick={() => router.push("/admin")}>
                    <Users className="mr-2 h-4 w-4" />
                    لوحة الإدارة
                  </DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>تسجيل الخروج</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => router.push("/auth")}>تسجيل الدخول</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/auth?mode=signup")}>إنشاء حساب</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* قائمة الهامبرغر للشاشات الصغيرة */}
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* القائمة المنسدلة للشاشات الصغيرة */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* شريط البحث للموبايل */}
            <form onSubmit={handleSearch} className="md:hidden">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="ابحث عن الكتب والمؤلفين..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 w-full"
                />
              </div>
            </form>

            {/* روابط التنقل للموبايل */}
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="mr-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

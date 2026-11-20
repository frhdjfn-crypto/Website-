"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Download, Users, Star } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { getLibraryStats } from "@/lib/books-data"

export function HeroSection({ title, subtitle }: { title: string; subtitle: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const stats = getLibraryStats()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary/80 text-white">
      {/* خلفية مزخرفة */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200&text=📚')] opacity-5"></div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* العنوان الرئيسي */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">{title}</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
          </div>

          {/* شريط البحث */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="ابحث عن الكتب، المؤلفين، أو التصنيفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 pl-4 py-4 text-lg bg-white/95 border-0 text-gray-900 placeholder:text-gray-500"
              />
              <Button
                type="submit"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary-dark"
              >
                بحث
              </Button>
            </div>
          </form>

          {/* الإحصائيات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mx-auto mb-2">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">{stats.totalBooks.toLocaleString()}</div>
              <div className="text-white/80 text-sm">كتاب متاح</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mx-auto mb-2">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">{stats.totalAuthors}</div>
              <div className="text-white/80 text-sm">مؤلف</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mx-auto mb-2">
                <Download className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-white/80 text-sm">تحميل</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mx-auto mb-2">
                <Star className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <div className="text-white/80 text-sm">متوسط التقييم</div>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push("/categories")}
              className="text-lg px-8 py-3"
            >
              استكشف التصنيفات
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/authors")}
              className="text-lg px-8 py-3 bg-transparent border-white text-white hover:bg-white hover:text-primary"
            >
              تصفح المؤلفين
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

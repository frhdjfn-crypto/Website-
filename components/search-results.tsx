"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { searchBooks } from "@/lib/books-data"
import { BookCard } from "@/components/book-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, SortAsc, SortDesc } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Book } from "@/lib/types"

type SortOption = "title" | "author" | "year" | "rating" | "pages"
type SortDirection = "asc" | "desc"

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState<Book[]>([])
  const [filteredResults, setFilteredResults] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("title")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [yearFilter, setYearFilter] = useState<string>("all")

  // البحث الأولي
  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  // تطبيق الفلاتر والترتيب
  useEffect(() => {
    let filtered = [...results]

    // فلتر حسب التصنيف
    if (categoryFilter !== "all") {
      filtered = filtered.filter((book) => book.category === categoryFilter)
    }

    // فلتر حسب السنة
    if (yearFilter !== "all") {
      const currentYear = new Date().getFullYear()
      switch (yearFilter) {
        case "recent":
          filtered = filtered.filter((book) => book.year >= currentYear - 10)
          break
        case "classic":
          filtered = filtered.filter((book) => book.year < currentYear - 50)
          break
        case "modern":
          filtered = filtered.filter((book) => book.year >= currentYear - 50 && book.year < currentYear - 10)
          break
      }
    }

    // الترتيب
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredResults(filtered)
  }, [results, sortBy, sortDirection, categoryFilter, yearFilter])

  const performSearch = async (searchTerm: string) => {
    setLoading(true)
    try {
      // محاكاة تأخير البحث
      await new Promise((resolve) => setTimeout(resolve, 300))

      const searchResults = searchBooks(searchTerm)
      setResults(searchResults)
    } catch (error) {
      console.error("خطأ في البحث:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // تحديث URL
      const url = new URL(window.location.href)
      url.searchParams.set("q", searchQuery.trim())
      window.history.pushState({}, "", url.toString())

      performSearch(searchQuery.trim())
    }
  }

  const clearFilters = () => {
    setCategoryFilter("all")
    setYearFilter("all")
    setSortBy("title")
    setSortDirection("asc")
  }

  // الحصول على التصنيفات المتاحة في النتائج
  const availableCategories = [...new Set(results.map((book) => book.category))]

  return (
    <div className="space-y-6">
      {/* شريط البحث */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">البحث في المكتبة</h1>
          {query && (
            <p className="text-muted-foreground">
              نتائج البحث عن: <span className="font-semibold">"{query}"</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="ابحث عن الكتب، المؤلفين، أو التصنيفات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "جاري البحث..." : "بحث"}
          </Button>
        </form>
      </div>

      {/* الفلاتر والترتيب */}
      {results.length > 0 && (
        <div className="flex flex-wrap gap-4 items-center justify-between bg-muted/50 p-4 rounded-lg">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="secondary" className="text-sm">
              {filteredResults.length} من {results.length} نتيجة
            </Badge>

            {/* فلتر التصنيف */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                {availableCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* فلتر السنة */}
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="الفترة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفترات</SelectItem>
                <SelectItem value="recent">حديث (آخر 10 سنوات)</SelectItem>
                <SelectItem value="modern">معاصر (10-50 سنة)</SelectItem>
                <SelectItem value="classic">كلاسيكي (أكثر من 50 سنة)</SelectItem>
              </SelectContent>
            </Select>

            {(categoryFilter !== "all" || yearFilter !== "all") && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                مسح الفلاتر
              </Button>
            )}
          </div>

          {/* الترتيب */}
          <div className="flex gap-2 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 ml-2" />
                  ترتيب حسب
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("title")}>العنوان</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("author")}>المؤلف</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("year")}>سنة النشر</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("rating")}>التقييم</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("pages")}>عدد الصفحات</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            >
              {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* النتائج */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResults.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl">📚</div>
              <h3 className="text-xl font-semibold">لم نجد أي نتائج</h3>
              <p className="text-muted-foreground">لم نتمكن من العثور على كتب تطابق بحثك عن "{query}"</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>جرب:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>التحقق من الإملاء</li>
                  <li>استخدام كلمات مختلفة</li>
                  <li>البحث بكلمات أقل</li>
                  <li>استخدام مصطلحات أعم</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl">🔍</div>
              <h3 className="text-xl font-semibold">ابدأ البحث</h3>
              <p className="text-muted-foreground">استخدم شريط البحث أعلاه للعثور على الكتب التي تبحث عنها</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookCard } from "@/components/book-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, BookOpen, Star, TrendingUp, Filter } from "lucide-react"
import type { Book } from "@/lib/types"

interface CategoryDetailProps {
  categoryName: string
  books: Book[]
}

export function CategoryDetail({ categoryName, books }: CategoryDetailProps) {
  const [sortedBooks, setSortedBooks] = useState<Book[]>(books)
  const [sortBy, setSortBy] = useState("rating")
  const router = useRouter()

  const handleSort = (value: string) => {
    setSortBy(value)
    const sorted = [...books].sort((a, b) => {
      switch (value) {
        case "rating":
          return b.rating - a.rating
        case "year":
          return b.year - a.year
        case "title":
          return a.title.localeCompare(b.title)
        case "author":
          return a.author.localeCompare(b.author)
        case "pages":
          return (b.pages || 0) - (a.pages || 0)
        default:
          return 0
      }
    })
    setSortedBooks(sorted)
  }

  const addComment = (bookId: number, text: string, author: string) => {
    setSortedBooks(
      sortedBooks.map((book) => {
        if (book.id === bookId) {
          return {
            ...book,
            comments: [...book.comments, { text, author, date: new Date().toLocaleDateString("ar-SA") }],
          }
        }
        return book
      }),
    )
  }

  // إحصائيات التصنيف
  const averageRating = books.reduce((sum, book) => sum + book.rating, 0) / books.length
  const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0)
  const latestYear = Math.max(...books.map((book) => book.year))
  const oldestYear = Math.min(...books.map((book) => book.year))

  return (
    <div className="space-y-6">
      {/* زر العودة */}
      <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2 hover:bg-muted">
        <ArrowRight className="h-4 w-4" />
        العودة للتصنيفات
      </Button>

      {/* معلومات التصنيف */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">تصنيف: {categoryName}</h1>
        <p className="text-muted-foreground mb-4">{books.length} كتاب متاح في هذا التصنيف</p>
      </div>

      {/* إحصائيات التصنيف */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد الكتب</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{books.length}</div>
            <p className="text-xs text-muted-foreground">كتاب متاح</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">من 5 نجوم</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الصفحات</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">صفحة للقراءة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الفترة الزمنية</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestYear - oldestYear + 1}</div>
            <p className="text-xs text-muted-foreground">
              سنة ({oldestYear}-{latestYear})
            </p>
          </CardContent>
        </Card>
      </div>

      {/* شريط الفلترة */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">كتب التصنيف</h3>
            <Select value={sortBy} onValueChange={handleSort}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                <SelectItem value="year">الأحدث</SelectItem>
                <SelectItem value="title">ترتيب أبجدي</SelectItem>
                <SelectItem value="author">حسب المؤلف</SelectItem>
                <SelectItem value="pages">عدد الصفحات</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* عرض الكتب */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedBooks.map((book) => (
          <BookCard key={book.id} book={book} onAddComment={addComment} />
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد كتب</h3>
          <p className="text-muted-foreground">لا توجد كتب في هذا التصنيف حالياً</p>
        </div>
      )}
    </div>
  )
}

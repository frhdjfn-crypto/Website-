"use client"

import { useEffect, useState } from "react"
import { BookOpen, Star, Eye, AlertCircle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllBooks } from "@/lib/books-data"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { BookCover } from "@/components/book-cover"
import type { Book } from "@/lib/types"

export function NewestBooks() {
  const router = useRouter()
  const { toast } = useToast()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNewestBooks()
  }, [])

  const loadNewestBooks = async () => {
    try {
      setLoading(true)

      const newestBooks = getAllBooks()
        .slice()
        .sort((a, b) => new Date(b.addedDate || 0).getTime() - new Date(a.addedDate || 0).getTime())
        .slice(0, 10)
      setBooks(newestBooks)

      if (newestBooks.length === 0) {
        toast({
          title: "لا توجد كتب جديدة",
          description: "لم يتم العثور على كتب مضافة حديثًا إلى المكتبة",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading newest books:", error)
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل أحدث الكتب",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full overflow-hidden dark:bg-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />

            <h3 className="text-xl font-bold">جاري تحميل أحدث الكتب...</h3>
          </div>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full overflow-hidden rounded-3xl border-0 bg-[#f2efe7] shadow-sm">
      <CardHeader className="bg-transparent px-4 pt-8 text-center sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="flex items-center justify-center gap-3 text-2xl font-bold text-[#205c3a] sm:text-3xl">
              <BookOpen className="h-6 w-6" />
              أحدث الكتب
            </h3>
            <p className="mt-2 text-sm text-muted-foreground sm:text-lg">
              اكتشف أحدث الإضافات إلى مكتبتنا — اضغط على الغلاف لعرض التفاصيل
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-white/20 hover:bg-white/30 border-white/40 text-white rounded-full h-8 w-8"
              onClick={loadNewestBooks}
              title="تحديث القائمة"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {books.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد كتب جديدة متاحة</h3>
            <p className="text-muted-foreground mb-4">لم يتم العثور على كتب جديدة في مجلد الكتب</p>
            <Button onClick={loadNewestBooks} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              إعادة المحاولة
            </Button>
          </div>
        ) : (
          <div
            dir="rtl"
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-pr-4 sm:px-8 sm:scroll-pr-8"
          >
            {books.map((book, index) => (
              <article key={book.id} className="w-[calc(50%_-_8px)] shrink-0 snap-start">
                <Card className="group h-full overflow-hidden rounded-2xl border-0 bg-transparent shadow-none transition-transform duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <Link href={`/book/${book.id}`} className="block">
                      <BookCover
                        src={book.imageUrl}
                        alt={`غلاف كتاب ${book.title}`}
                        className="aspect-[2/3] rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 shadow-md"
                      />
                    </Link>
                    {index < 3 && (
                      <div className="absolute right-2 top-2">
                        <Badge variant="default" className="bg-primary text-primary-foreground text-xs font-bold">
                          جديد
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col items-center gap-2 px-2 py-3 text-center sm:px-3">
                    <Link href={`/book/${book.id}`} className="w-full min-w-0">
                      <h4 className="line-clamp-2 text-base font-bold leading-snug transition-colors hover:text-primary sm:text-lg">
                        {book.title}
                      </h4>
                    </Link>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{book.author}</p>

                    <div className="flex items-center gap-1.5 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-medium">{book.rating.toFixed(1)}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                      onClick={() => router.push(`/book/${book.id}`)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      <span className="text-xs">عرض وتحميل</span>
                    </Button>
                  </div>
                </Card>
              </article>
            ))}
          </div>
        )}

        <div className="flex justify-center border-t border-black/5 p-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/library")}>
            عرض جميع الكتب
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

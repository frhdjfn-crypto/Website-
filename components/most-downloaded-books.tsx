"use client"

import { Download, Star, Eye } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllBooks } from "@/lib/books-data"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookCover } from "@/components/book-cover"

export function MostDownloadedBooks() {
  const router = useRouter()
  // ترتيب الكتب حسب عدد التحميلات
  const mostDownloadedBooks = getAllBooks()
    .filter((book) => book.downloadCount && book.downloadCount > 0)
    .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
    .slice(0, 10) // أعلى 10 كتب

  const formatDownloadCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toLocaleString()
  }

  return (
    <Card className="w-full overflow-hidden rounded-3xl border-0 bg-[#f2efe7] shadow-sm">
      <CardHeader className="bg-transparent px-4 pt-8 text-center sm:px-8">
        <div className="flex items-center justify-center">
          <div>
            <h3 className="flex items-center justify-center gap-3 text-2xl font-bold text-[#205c3a] sm:text-3xl">
              <Download className="h-6 w-6" />
              الكتب الأكثر تحميلاً
            </h3>
            <p className="mt-2 text-sm text-muted-foreground sm:text-lg">أشهر الكتب التي يختارها القراء</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {mostDownloadedBooks.length ? (
          <div
            dir="rtl"
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-pr-4 sm:px-8 sm:scroll-pr-8"
          >
            {mostDownloadedBooks.map((book, index) => (
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
                    <div className="absolute right-2 top-2">
                      <Badge
                        variant="default"
                        className="flex h-8 w-8 items-center justify-center bg-red-500 p-0 text-sm font-bold text-white"
                      >
                        {index + 1}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col items-center gap-2 px-2 py-3 text-center sm:px-3">
                    <Link href={`/book/${book.id}`} className="w-full min-w-0">
                      <h4 className="line-clamp-2 text-base font-bold leading-snug transition-colors hover:text-primary sm:text-lg">
                        {book.title}
                      </h4>
                    </Link>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{book.author}</p>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-green-600">
                        <Download className="h-3 w-3" />
                        <span className="font-medium">{formatDownloadCount(book.downloadCount || 0)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{book.rating}</span>
                      </div>
                    </div>

                    <Badge variant="outline" className="w-fit text-xs">
                      {book.category}
                    </Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                      onClick={() => router.push(`/book/${book.id}`)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      <span className="text-xs">عرض التفاصيل</span>
                    </Button>
                  </div>
                </Card>
              </article>
            ))}
          </div>
        ) : (
          <p className="px-4 py-12 text-center text-muted-foreground">لا توجد كتب متاحة للعرض حالياً</p>
        )}

        {/* مؤشر التحكم */}
        <div className="flex items-center justify-between p-4 bg-muted/30 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Download className="h-4 w-4" />
            <span>يتم التحديث يومياً</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/trending")}>
            عرض المزيد
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

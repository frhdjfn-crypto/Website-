"use client"

import { useState } from "react"
import { Download, Star, Eye } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllBooks } from "@/lib/books-data"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function MostDownloadedBooks() {
  const router = useRouter()
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  // ترتيب الكتب حسب عدد التحميلات
  const mostDownloadedBooks = getAllBooks()
    .filter((book) => book.downloadCount && book.downloadCount > 0)
    .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
    .slice(0, 10) // أعلى 10 كتب

  const handleImageError = (bookId: number) => {
    setImageErrors((prev) => ({ ...prev, [bookId]: true }))
  }

  const formatDownloadCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toLocaleString()
  }

  return (
    <Card className="mb-8 overflow-hidden rounded-3xl border-0 bg-[#f2efe7] shadow-sm">
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
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-4 pb-8 pt-5 lg:grid-cols-3 lg:gap-x-8 sm:px-8">
            {mostDownloadedBooks.map((book, index) => (
              <div
                key={book.id}
                className="min-w-0"
                onClick={() => router.push(`/book/${book.id}`)}
              >
                <Card className="group h-full cursor-pointer overflow-hidden rounded-2xl border-0 bg-transparent shadow-none transition-transform duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 shadow-md">
                    {book.imageUrl && !imageErrors[book.id] ? (
                      <Image
                        src={book.imageUrl || "/placeholder.svg"}
                        alt={`غلاف كتاب ${book.title}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform"
                        onError={() => handleImageError(book.id)}
                        sizes="320px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white">
                        <Download className="h-12 w-12" />
                      </div>
                    )}
                    {/* شارة الترتيب */}
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="default"
                        className="text-sm bg-red-500 text-white font-bold w-8 h-8 flex items-center justify-center p-0"
                      >
                        {index + 1}
                      </Badge>
                    </div>
                  </div>

                  {/* معلومات الكتاب */}
                  <div className="flex min-w-0 flex-1 flex-col items-center gap-2 px-2 py-3 text-center sm:px-3">
                    <h4 className="line-clamp-2 text-base font-bold leading-snug transition-colors hover:text-primary sm:text-lg">
                      {book.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>

                    {/* إحصائيات */}
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

                    <Badge variant="outline" className="text-xs w-fit">
                      {book.category}
                    </Badge>

                    {/* زر العرض */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="text-xs">عرض التفاصيل</span>
                    </Button>
                  </div>
                </Card>
              </div>
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

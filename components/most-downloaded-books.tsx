"use client"

import { useEffect, useState, useRef } from "react"
import { Download, ChevronLeft, ChevronRight, Star, Eye } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllBooks } from "@/lib/books-data"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function MostDownloadedBooks() {
  const router = useRouter()
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      const handleScroll = () => {
        setScrollPosition(container.scrollLeft)
        setMaxScroll(container.scrollWidth - container.clientWidth)
      }

      // تحديث قيمة maxScroll عند تحميل المكون
      setMaxScroll(container.scrollWidth - container.clientWidth)

      container.addEventListener("scroll", handleScroll)
      window.addEventListener("resize", handleScroll)

      return () => {
        container.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", handleScroll)
      }
    }
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <Card className="mb-8 dark:bg-gray-800 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-bold">
              <Download className="h-5 w-5" />
              الكتب الأكثر تحميلاً
            </h3>
            <p className="text-white/90 text-sm">أشهر الكتب التي يحملها القراء</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-white/20 hover:bg-white/30 border-white/40 text-white rounded-full h-8 w-8"
              onClick={scrollLeft}
              disabled={scrollPosition <= 0}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">السابق</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/20 hover:bg-white/30 border-white/40 text-white rounded-full h-8 w-8"
              onClick={scrollRight}
              disabled={scrollPosition >= maxScroll}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">التالي</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          {/* مؤشرات التمرير الجانبي */}
          {scrollPosition > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background/80 to-transparent z-10 pointer-events-none" />
          )}

          {scrollPosition < maxScroll && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background/80 to-transparent z-10 pointer-events-none" />
          )}

          {/* شريط التنقل الجانبي */}
          <div
            className="flex overflow-x-auto scrollbar-hide cursor-grab py-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            ref={scrollContainerRef}
          >
            {mostDownloadedBooks.map((book, index) => (
              <div
                key={book.id}
                className="flex-shrink-0 w-[340px] px-2 snap-start"
                onClick={() => router.push(`/book/${book.id}`)}
              >
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border hover:border-primary/50 cursor-pointer">
                  {/* صورة الكتاب - كبيرة */}
                  <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary-dark/10 rounded-lg overflow-hidden group">
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
                  <div className="flex-1 min-w-0 space-y-2">
                    <h4 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors">
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
        </div>

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

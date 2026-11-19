"use client"

import { useEffect, useState } from "react"
import {
  Clock,
  Star,
  Eye,
  Calendar,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getNewestAvailableBooks, getFileStats } from "@/lib/books-data"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import type { Book } from "@/lib/types"

export function NewestBooks() {
  const router = useRouter()
  const { toast } = useToast()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const [fileStats, setFileStats] = useState<any>(null)

  useEffect(() => {
    loadNewestBooks()
  }, [])

  const loadNewestBooks = async () => {
    try {
      setLoading(true)

      // الحصول على أحدث الكتب المتاحة
      const newestBooks = await getNewestAvailableBooks(10)
      setBooks(newestBooks)

      // الحصول على إحصائيات الملفات
      const stats = getFileStats()
      setFileStats(stats)

      if (newestBooks.length === 0) {
        toast({
          title: "لا توجد كتب جديدة",
          description: "لم يتم العثور على كتب جديدة متاحة للتحميل",
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

  const handleImageError = (bookId: number) => {
    setImageErrors((prev) => ({ ...prev, [bookId]: true }))
  }

  const formatDate = (addedDate?: string) => {
    if (!addedDate) return "غير محدد"

    const added = new Date(addedDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - added.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "اليوم"
    if (diffDays === 1) return "أمس"
    if (diffDays < 7) return `منذ ${diffDays} أيام`
    if (diffDays < 30) return `منذ ${Math.ceil(diffDays / 7)} أسابيع`
    return `منذ ${Math.ceil(diffDays / 30)} شهر`
  }

  if (loading) {
    return (
      <Card className="mb-8 dark:bg-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 animate-spin" />
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
    <Card className="mb-8 dark:bg-gray-800 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-bold">
              <Clock className="h-5 w-5" />
              أحدث الكتب المتاحة
              {fileStats && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/40">
                  {fileStats.available} متاح
                </Badge>
              )}
            </h3>
            <p className="text-white/90 text-sm">
              الكتب الجديدة المتاحة للتحميل من مكتبتنا
              {fileStats && fileStats.recentlyAdded > 0 && (
                <span className="mr-2">• {fileStats.recentlyAdded} جديد هذا الأسبوع</span>
              )}
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
          <div className="grid grid-cols-2 gap-3 p-3 sm:gap-4 sm:p-4">
              {books.map((book, index) => (
                <div
                  key={book.id}
                  className="min-w-0"
                  onClick={() => router.push(`/book/${book.id}`)}
                >
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border hover:border-blue-500/50 cursor-pointer group">
                    {/* صورة الكتاب - كبيرة */}
                    <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden">
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
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          <Clock className="h-12 w-12" />
                        </div>
                      )}
                      {/* شارة "جديد" أو "متاح" */}
                      <div className="absolute top-2 right-2">
                        {index < 3 ? (
                          <Badge
                            variant="default"
                            className="text-xs bg-green-500 text-white font-bold"
                          >
                            جديد
                          </Badge>
                        ) : (
                          <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
                        )}
                      </div>
                    </div>

                    {/* معلومات الكتاب */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <h4 className="font-semibold text-sm line-clamp-2 hover:text-blue-600 transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>

                      {/* إحصائيات */}
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 text-blue-600">
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">{formatDate(book.addedDate)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{book.rating}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {book.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          {book.fileSize}
                        </Badge>
                      </div>

                      {/* زر العرض */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-xs">عرض وتحميل</span>
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
          </div>
        )}

        {/* مؤشر التحكم */}
        <div className="flex items-center justify-between p-4 bg-muted/30 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>ملفات متاحة للتحميل</span>
            </div>
            {fileStats && (
              <div className="flex items-center gap-4">
                <span>المجموع: {fileStats.total}</span>
                <span>متاح: {fileStats.available}</span>
                {fileStats.unavailable > 0 && <span className="text-red-500">غير متاح: {fileStats.unavailable}</span>}
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/library")}>
            عرض جميع الكتب
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
